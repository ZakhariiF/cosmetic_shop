import Button from 'components/Button';
import Header from 'components/Header/Header';
import Indicator from 'components/Indicator';
import Input from 'components/Input';
import NativePicker from 'components/NativePicker';
import {Fonts, Colors} from 'constant';
import config from 'constant/config';
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import rootStyle from 'rootStyle';
import {getFieldValues} from 'services';
import {isValidEmail} from 'utils';
import {types} from '../ducks';
import {bookedForMoreUser} from '../thunks';

const BookingForm = ({navigation}) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.booking.isBooking);
  const [locArr, setLocArr] = useState([]);
  const [preferedTime, setPreferTime] = useState([]);
  const [partySizeArr, setpartySizeArr] = useState([]);
  const [occasionArr, setOccasionArr] = useState([]);
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    states: '',
    postalCode: '',
    phoneNumber: '',
    selectedLoc: '',
    selectedTime: '',
    partySize: '',
    occasion: '',
    notes: '',
  });

  const {
    firstName,
    lastName,
    email,
    address1,
    address2,
    city,
    states,
    postalCode,
    phoneNumber,
    selectedLoc,
    selectedTime,
    partySize,
    occasion,
    notes,
  } = state;

  useEffect(() => {
    getAllFields();
  }, []);

  const getAllFields = async () => {
    const data = await getFieldValues();
    const fields = data?.Fields || [];
    console.log(data);
    let locArr = [],
      occaArr = [],
      timeArr = [],
      sizeArr = [];

    fields.forEach((field) => {
      if (field['Title'] === 'Preferred Shop') {
        field['Choices'].forEach((e) => {
          locArr.push({label: e.Label, value: e.Label});
        });
      } else if (field['Title'] === 'Time') {
        field['Choices'].forEach((e) => {
          timeArr.push({label: e.Label, value: e.Label});
        });
      } else if (field['Title'] === 'Party Size') {
        field['Choices'].forEach((e) => {
          sizeArr.push({label: e.Label, value: e.Label});
        });
      } else if (field['Title'] === 'Occasion') {
        field['Choices'].forEach((e) => {
          occaArr.push({label: e.Label, value: e.Label});
        });
      }
    });

    setLocArr(locArr);
    setPreferTime(timeArr);
    setpartySizeArr(sizeArr);
    setOccasionArr(occaArr);
  };

  const onSubmit = () => {
    dispatch(bookedForMoreUser(state)).then((response) => {
      if (response.type === types.BOOKING_FORM_SUCCESS) {
        navigation.popToTop();
      }
    });
  };

  const checkFormValid = () => {
    let valid = false;

    if (
      !email ||
      !firstName ||
      !lastName ||
      !isValidEmail(email) ||
      !address1 ||
      !address2 ||
      !city ||
      !states ||
      !postalCode ||
      !phoneNumber ||
      !selectedLoc ||
      !selectedTime ||
      !partySize ||
      !occasion
    ) {
      valid = true;
    }
    return valid;
  };

  let isValid = checkFormValid();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : ''}
      style={styles.container}>
      <Header title="BOOKING FORM" isTab />
      <SafeAreaView />

      <ScrollView>
        <View style={rootStyle.innerContainer}>
          <Input
            name="First Name"
            autoCapitalize="words"
            placeholder="First Name"
            value={firstName}
            onChangeText={(e) => setState((s) => ({...s, firstName: e}))}
          />
          <Input
            name="Last Name"
            placeholder="Last Name"
            value={lastName}
            onChangeText={(e) => setState((s) => ({...s, lastName: e}))}
          />
          <Input
            name="Email"
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={(e) => setState((s) => ({...s, email: e}))}
          />
          <Input
            name="Address 1"
            placeholder="Address 1"
            value={address1}
            onChangeText={(e) => setState((s) => ({...s, address1: e}))}
          />

          <Input
            name="Address 2"
            placeholder="Address 2"
            value={address2}
            onChangeText={(e) => setState((s) => ({...s, address2: e}))}
          />

          <View style={styles.rowContainer}>
            <View style={{width: '48%'}}>
              <Input
                placeholder="City"
                name="City"
                value={city}
                onChangeText={(e) => setState((s) => ({...s, city: e}))}
              />
            </View>

            <View style={{width: '48%'}}>
              <Input
                placeholder="State"
                name="State"
                value={states}
                onChangeText={(e) => setState((s) => ({...s, states: e}))}
              />
            </View>
          </View>

          <View style={styles.rowContainer}>
            <View style={{width: '48%'}}>
              <Input
                placeholder="Postal Code"
                name="Postal Code"
                value={postalCode}
                onChangeText={(e) => setState((s) => ({...s, postalCode: e}))}
              />
            </View>

            <View style={{width: '48%'}}>
              <Input
                name="Phone Number"
                returnKeyType="done"
                keyboardType="number-pad"
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={(e) => setState((s) => ({...s, phoneNumber: e}))}
              />
            </View>
          </View>

          {/*  */}
          <Text style={styles.labelName}>Preferred Shop</Text>
          <NativePicker
            selectedValue={selectedLoc}
            placeholder={'Preferred Shop'}
            items={locArr}
            onValueChange={(i) => setState((s) => ({...s, selectedLoc: i}))}
          />

          <Text style={styles.labelName}>Preferred Time</Text>
          <NativePicker
            selectedValue={selectedTime}
            placeholder={'Preferred Time'}
            items={preferedTime}
            onValueChange={(i) => setState((s) => ({...s, selectedTime: i}))}
          />

          <Text style={styles.labelName}>Party Size</Text>
          <NativePicker
            selectedValue={partySize}
            placeholder={'Party Size'}
            items={partySizeArr}
            onValueChange={(i) => setState((s) => ({...s, partySize: i}))}
          />

          <Text style={styles.labelName}>OCCASION</Text>
          <NativePicker
            selectedValue={occasion}
            placeholder={'Occasion'}
            items={occasionArr}
            onValueChange={(i) => setState((s) => ({...s, occasion: i}))}
          />

          <Text
            style={{
              fontSize: 18,
              fontFamily: Fonts.AvenirNextRegular,
              marginTop: 20,
            }}>
            NOTES:
          </Text>

          <Input
            labelStyle={{marginTop: 0}}
            containerStyle={styles.noteContainer}
            multiline
            placeholder="Your notes here..."
            value={notes}
            onChangeText={(e) => setState((s) => ({...s, notes: e}))}
          />

          <Button disabled={isValid} name="Submit" onButtonPress={onSubmit} />
        </View>
      </ScrollView>

      {isLoading ? <Indicator /> : null}
    </KeyboardAvoidingView>
  );
};

export default BookingForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelName: {
    fontSize: 15,
    color: Colors.light_gray,
    marginTop: 25,
    fontFamily: Fonts.AvenirNextRegular,
  },
  noteContainer: {
    borderWidth: 1,
    height: 150,
    marginBottom: 20,
    marginTop: 0,
    borderColor: Colors.input_color,
    padding: 10,
  },
});
