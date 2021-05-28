import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Header from 'components/Header/Header';
import rootStyle from 'rootStyle';
import {CreditCardInput} from 'react-native-credit-card-input';
import {Colors, Fonts, Images} from 'constant';
import CheckBox from 'components/Checkbox';
import Button from 'components/Button';
import {get} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {addCreditCard} from '../thunks';
import Indicator from 'components/Indicator';
import DismissKeyboard from 'components/DismissKeyboard';
import MParticle from 'react-native-mparticle';

const Addcc = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isLoading = useSelector((state) => state.booking.isCCLoading);
  const location = useSelector((state) => state.booking.selectedLocation);
  const dispatch = useDispatch();
  const [isdefault, setDefault] = useState(true);

  const [cardInfo, setCardInfo] = useState('');
  // alert(JSON.stringify(userInfo));

  const onAddCard = () => {
    MParticle.logEvent('Save Card', MParticle.EventType.Other, {
      'Source Page': 'Add card',
    });

    const [month, year] = get(cardInfo, 'values.expiry', '').split('/');
    let type = 2;
    if (get(cardInfo, 'values.type') === 'master-card') {
      type = 3;
    } else if (get(cardInfo, 'values.type') === 'american-express') {
      type = 1;
    } else if (get(cardInfo, 'values.type') === 'discover') {
      type = 4;
    }

    const data = {
      SpaID: location.bookerLocationId,
      CustomerID: get(userInfo, 'bookerID', ''),
      CreditCard: {
        Type: {
          ID: type,
        },
        Number: get(cardInfo, 'values.number'),
        NameOnCard: get(cardInfo, 'values.name'),
        ExpirationDateOffset: `20${year}-${month}-01T00:00:00+00:00`,
        SecurityCode: get(cardInfo, 'values.cvc'),
      },
    };

    dispatch(addCreditCard(data));
  };

  // console.log('userInfo', userInfo);

  return (
    <View style={[rootStyle.container, {backgroundColor: Colors.white}]}>
      <Header title="ADD A CREDIT CARD" isTab />
      <DismissKeyboard>
        <ScrollView>
          <View style={styles.container}>
            <CreditCardInput
              labels={{
                name: 'Name On Card',
                number: 'Card Number',
                expiry: 'Expiration Date',
                cvc: 'CVV',
              }}
              placeholders={{
                name: 'Name On Card',
                number: '1234 5678 1234 5678',
                expiry: 'MM/YY',
                cvc: 'CVV / CVC',
              }}
              requiresName
              cardScale={1.0}
              labelStyle={styles.cardLabelStyle}
              // expireContainer={{width: '50%'}}
              onChange={(cardValues) => setCardInfo(cardValues)}
              inputStyle={styles.cardInputStyle}
              cardImageFront={Images.cardImageFront}
              cardImageBack={Images.cardImageBack}
            />

            <View style={styles.bottomContainer}>
              <CheckBox
                title="Make default?"
                isChecked={isdefault}
                onPressed={() => setDefault(!isdefault)}
              />

              <Button
                disabled={!cardInfo.valid}
                name="Add Card"
                onButtonPress={onAddCard}
              />
            </View>
          </View>
        </ScrollView>
      </DismissKeyboard>

      {isLoading ? <Indicator /> : null}
    </View>
  );
};

export default Addcc;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    marginTop: 50,
  },
  cardLabelStyle: {
    color: Colors.light_brown,
    fontFamily: Fonts.AvenirNextRegular,
    marginTop: 10,
    marginBottom: 3,
    fontSize: 15,
  },
  cardInputStyle: {
    fontFamily: Fonts.AvenirNextMedium,
    fontSize: 18,
    color: Colors.header_title,
    borderBottomColor: Colors.input_color,
    borderBottomWidth: 1,
    height: 50,
  },
  bottomContainer: {
    marginTop: 30,
  },
});
