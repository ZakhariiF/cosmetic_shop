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
import MParticle from "react-native-mparticle";

const Addcc = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isLoading = useSelector((state) => state.booking.isCCLoading);
  const dispatch = useDispatch();
  const [isdefault, setDefault] = useState(true);

  const [cardInfo, setCardInfo] = useState('');
  // alert(JSON.stringify(userInfo));

  const onAddCard = () => {
    MParticle.logEvent('Sace Card', MParticle.EventType.Other, {
      'Source Page': 'Add card',
    });
    const data = {
      SpaID: 112,
      // CustomerID: 119704688,
      CustomerID: get(userInfo, 'profile.bookerId', ''),
      CreditCard: {
        Type: {
          ID: 2,
          Name: get(cardInfo, 'values.type'),
        },
        Number: get(cardInfo, 'values.number'),
        NameOnCard: 'Test Customer',
        ExpirationDate: '/Date(1638259200000-0500)/',
        SecurityCode: get(cardInfo, 'values.cvc'),
        Address: {
          Street1: 'string',
          Street2: 'string',
          City: 'Irvine',
          State: 'CA',
          Zip: '92602',
          Country: {
            ID: 1,
            Name: 'United States',
          },
        },
      },
    };

    console.log('payload>>', data);

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
                number: 'Card Number',
                expiry: 'Expiration Date',
                cvc: 'CVV',
              }}
              placeholders={{
                number: '1234 5678 1234 5678',
                expiry: 'MM/YY',
                cvc: 'CVV / CVC',
              }}
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
                titile="Make default?"
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
  },
  bottomContainer: {
    marginTop: 30,
  },
});
