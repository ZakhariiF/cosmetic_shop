import React, {useState, useCallback} from 'react';
import {View, Text} from 'react-native';
import Button from 'components/Button';
import CheckBox from 'components/Checkbox';
import Authheader from 'components/Header/Authheader';
import Header from 'components/Header/Header';
import Input from 'components/Input';
import styles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {onregister} from '../thunks';
import Indicator from 'components/Indicator';
import {addToContactList} from 'services/Emarsys';

const Phone = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [phone, setPhone] = useState('');
  const [isChecked, setChecked] = useState(false);
  const isLoading = useSelector((state) => state.auth.isLoading);

  const {
    params: {firstName, lastName, email, isEmailOptIn},
  } = route;

  const onNext = useCallback(async () => {
    dispatch(
      onregister({
        firstName,
        lastName,
        email,
        phone,
      }),
    ).then(async (response) => {
      if (response.type === 'REGISTER_SUCCESS') {
        if (isChecked) {
          const emarsysData = await addToContactList({
            sourceType: 'DrybarshopsUserReq',
            firstName,
            lastName,
            email,
            homePhone: 'Mobile Phone',
            phoneNumber: phone,
          });
          console.log('Emarsys response:', emarsysData);
        }
        if (isEmailOptIn) {
          const emarsysData = await addToContactList({
            sourceType: 'DrybarshopsUserReq',
            firstName,
            lastName,
            email,
            homePhone: 'Mobile Phone',
            phoneNumber: phone,
            isEmail: true,
          });
          console.log('Emarsys response:', emarsysData);
        }
        navigation.navigate('CheckEmail', {email});
      }
    });
  }, [firstName, lastName, email, phone]);

  return (
    <View style={styles.container}>
      <Authheader />
      <Header title="PHONE NUMBER" />
      <KeyboardAwareScrollView>
        <View style={styles.innerContainer}>
          <Text style={styles.heading}>
            Tell the user why we need their phone number and how it will be used
            lorem ipsum dolor
          </Text>
          <Input
            name="Phone"
            placeholder="707-555-1212"
            value={phone}
            onChangeText={(i) => setPhone(i)}
            keyboardType="number-pad"
            returnKeyType={'done'}
          />
          <CheckBox
            isChecked={isChecked}
            titile="SMS opt in"
            onPressed={() => setChecked(!isChecked)}
          />

          <Button
            disabled={phone.length < 10}
            name="Next"
            containerStyle={{marginTop: 40}}
            onButtonPress={onNext}
          />
        </View>
      </KeyboardAwareScrollView>

      {isLoading ? <Indicator /> : null}
    </View>
  );
};

export default Phone;
