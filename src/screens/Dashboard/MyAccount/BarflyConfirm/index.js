import React, {useState, useEffect} from 'react';
import {get} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollView, View, Text} from 'react-native';
import {useQuery} from '@apollo/client';
import Dialog from 'react-native-dialog';
import moment from 'moment';

import Header from 'components/Header/Header';
import Button from 'components/Button';
import {updateCustomer} from '../thunks';
import {types} from '../ducks';

import rootStyle from 'rootStyle';
import * as API from 'services';
import {doQuery} from 'services/Contentful';

import styles from './styles';
import {AlertHelper} from 'utils/AlertHelper';
import CheckBox from 'components/Checkbox';

const BarflyConfirm = ({navigation, route}) => {
  const customerLocation = useSelector((state) => state.account.location);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [firstCheckboxData, setFirstCheckData] = useState('');
  const [secondCheckboxData, setSecondCheckData] = useState('');
  const [confirmationData, setConfirmationData] = useState('');
  const [firstChecked, setFirstChecked] = useState(false);
  const [secondChecked, setSecondChecked] = useState(false);

  const {membership, customer, card} = route.params;

  console.log('Membership:', membership);

  const price = get(membership, 'MembershipBillableItem.Price.Amount');

  const gplQuery = `{
    channelResourceCollection(where: {slug: "barfly-configurations"}) {
        items {
            sys {
            id
            }
            configuration
        }
    }
  }`;

  useEffect(() => {
    if (!membership || !customer || !card) {
      navigation.navigate('BarflyMembershipEnrollment');
    }
  }, [membership, customer, card]);

  useEffect(() => {
    doQuery(gplQuery).then((data) => {
      const channelResourceItem = data?.channelResourceCollection?.items || [];
      if (channelResourceItem && channelResourceItem.length > 0) {
        setFirstCheckData(
          (
            channelResourceItem[0].configuration?.barfly?.checkbox_one || ''
          ).replace('${price}', '$' + price),
        );
        setSecondCheckData(
          (
            channelResourceItem[0].configuration?.barfly?.checkbox_two || ''
          ).replace('${price}', '$' + price),
        );
        setConfirmationData(
          (
            channelResourceItem[0].configuration?.barfly?.confirmation_text ||
            ''
          ).replace('${price}', '$' + price),
        );
      }
    });
  }, []);

  const getCardExpirationDate = () => moment(new Date(card.Year, card.Month - 1, 1)).format(
      'YYYY-MM-DDT00:00:00+00:00',
  );


  const addCreditCard = async () => {
    console.log(card);
    try {
      const data = await API.addCreditCardForCustomer(
        customerLocation.bookerLocationId,
        customer.ID,
        card,
        card.Type,
        getCardExpirationDate(),
      );

      if (data.IsSuccess || data.ErrorCode === 790) {
        const cardsData = await API.getCC(customer.ID, customer.LocationID);
        if (cardsData.IsSuccess) {
          const currentCard = cardsData.CreditCards.filter((c) =>
            c.CreditCard.Number.endsWith(card.Number.slice(-4)),
          );
          if (currentCard.length) {
            return currentCard[0];
          } else {
            return null;
          }
        } else {
          AlertHelper.showError(
            get(cardsData, 'ArgumentErrors[0].ErrorMessage') ||
              get(cardsData, 'ErrorMessage') ||
              'Server Error',
          );
        }
      } else {
        AlertHelper.showError(
          get(data, 'ArgumentErrors[0].ErrorMessage') ||
            get(data, 'ErrorMessage') ||
            'Server Error',
        );
      }
    } catch (e) {
      console.log('Add Card Issue:', e);
      if (e.response && e.response.status === 401) {
        navigation.navigate('Login');
      }
    }
  };

  const completeMembership = () => {
    dispatch(updateCustomer(customer)).then(async (response) => {
      if (response.type == types.UPDATE_CUSTOMER_DETAILS_SUCCESS) {
        const isCreditCardCreated = await addCreditCard();
        if (!isCreditCardCreated) {
          return;
        }

        try {
          const order = await API.createOrder(customer.ID);
          if (order && order.IsSuccess) {
            console.log('BillingCycle', moment().format(
              'yyyy-MM-ddT00:00:00+00:00',
            ));
            const addMemershipToOrder = await API.addMembershipToOrder({
              orderId: order.Order.ID,
              locationId: customerLocation.bookerLocationId,
              billingCycleStartDate: moment().format(
                'YYYY-MM-DDT00:00:00+00:00',
              ),
              membershipId: membership.ID,
            });
            const ExpirationDateOffset = getCardExpirationDate();
            const isPlaceOrder = await API.placeOrder(
              order.Order.ID,
              {...card, ExpirationDateOffset},
              addMemershipToOrder.Order.GrandTotal,
              customer.Address.Zip,
            );
            if (isPlaceOrder && isPlaceOrder.IsSuccess) {
              const res = await API.updateCustomerMembershipCreditCardOnFile({
                LocationID: customerLocation.bookerLocationId,
                CustomerID: customer.ID,
                CustomerMembershipID: get(
                  order,
                  'Order.Items[0].CustomerMembershipID',
                ),
                CustomerCreditCardID: get(isCreditCardCreated, 'ID'),
              });
              if (res.IsSuccess) {
                setShowModal(true);
              }
            } else {
              AlertHelper.showError(
                get(isPlaceOrder, 'ArgumentErrors[0].ErrorMessage') ||
                  get(isPlaceOrder, 'ErrorMessage') ||
                  'Server Error',
              );
            }
          }
        } catch (e) {
          console.log('Update Membership:', e);
          if (e.response && e.response.status === 302) {
            navigation.navigate('Login');
          }
        }
      }
    });
  };

  return (
    <View style={rootStyle.container}>
      <Header isTab title="BARFLY CONFIRMATION" />

      <ScrollView>
        <View
          style={[
            rootStyle.innerContainer,
            {backgroundColor: 'white', padding: 5},
          ]}>
          <View>
            <Text style={styles.title}>Summary of Charges</Text>
            <View style={[styles.summaryWrapper, styles.summaryCharges]}>
              <View style={styles.priceWrapper}>
                <Text style={styles.price}>{`$${price}`}</Text>
              </View>
              <View style={styles.priceSplitWrapper}>
                <Text style={styles.priceSplit}>/</Text>
              </View>
              <View style={styles.priceUnitWrapper}>
                <Text style={styles.priceUnit}>Month</Text>
                <Text>+ tax (where applicable)</Text>
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.title}>Preferred Shop</Text>
            <View style={styles.summaryWrapper}>
              <Text style={styles.locationTitle}>
                {get(customerLocation, 'title')}
              </Text>
              <Text>
                {get(customerLocation, 'contact.city')},{' '}
                {get(customerLocation, 'contact.state')},{' '}
                {get(customerLocation, 'contact.postalCode')}
              </Text>
              <Text>{get(customerLocation, 'contact.street1')}</Text>
            </View>
          </View>
          <View>
            <Text>{confirmationData}</Text>

            <CheckBox
              isChecked={firstChecked}
              titile={firstCheckboxData}
              onPressed={() => setFirstChecked(!firstChecked)}
            />

            <CheckBox
              isChecked={secondChecked}
              titile={secondCheckboxData}
              onPressed={() => setSecondChecked(!secondChecked)}
            />
          </View>
          <View>
            <Button
              name="Complete Membership"
              onButtonPress={completeMembership}
              disabled={!secondChecked || !firstChecked}
            />
          </View>
          <Dialog.Container visible={showModal}>
            <Dialog.Title>Thank you for your Membership Purchase</Dialog.Title>
            <Dialog.Description>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation. Ut enim ad minim
              veniam, quis nostrud exercitation.
            </Dialog.Description>
            <Dialog.Button
              color="black"
              label="Confirm"
              onPress={() => setShowModal(false)}
            />
          </Dialog.Container>
        </View>
      </ScrollView>
    </View>
  );
};

export default BarflyConfirm;
