import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Header from 'components/Header/Header';
import Input from 'components/Input';
import rootStyle from 'rootStyle';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {get} from 'lodash';
import {updateUserInfo} from 'screens/Auth/thunks';
import Indicator from 'components/Indicator';

const AccountInfo = ({navigation}) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isLoading = useSelector((state) => state.auth.isUpdate);
  const token = useSelector((state) => state.auth.token);
  const [firstName, setFirstName] = useState(
    get(userInfo, 'profile.firstName', ''),
  );
  const [lastName, setlastName] = useState(
    get(userInfo, 'profile.lastName', ''),
  );
  const [email, setEmail] = useState(get(userInfo, 'profile.login', ''));
  const [phoneNumber, setphoneNumber] = useState(
    get(userInfo, 'profile.mobilePhone', ''),
  );

  const onUpdate = () => {
    const obj = {
      firstName,
      lastName,
      email: email,
      mobilePhone: phoneNumber,
    };

    dispatch(updateUserInfo(get(userInfo, 'id', ''), obj)).then((response) => {
      console.log('response>?>?', response);
      if (response.type == 'UPDATE_LOGIN_DETAILS_SUCCESS') {
        navigation.goBack();
      }
    });
  };

  console.log('userInfo', userInfo);

  console.log('token', token);

  return (
    <View style={[rootStyle.container, styles.container]}>
      <Header title="ACCOUNT INFORMATION" isTab isSave onSave={onUpdate} />

      <KeyboardAwareScrollView>
        <View style={rootStyle.innerContainer}>
          <Text style={styles.headerTitle}>PROFILE</Text>
          <View style={rootStyle.seprator} />

          <Input
            value={firstName}
            isEdit
            name="First Name"
            placeholder="First Name"
            onChangeText={(e) => setFirstName(e)}
          />
          <Input
            value={lastName}
            isEdit
            name="Last Name"
            placeholder="Last Name"
            onChangeText={(e) => setlastName(e)}
          />

          <View style={styles.emailContainer}>
            <Text style={styles.emailHeader}>Email address</Text>
            <Text style={styles.email}>{email}</Text>
          </View>

          <Input
            isEdit
            name="Phone Number"
            placeholder="(714) 555-1212"
            value={phoneNumber}
            onChangeText={(e) => setphoneNumber(e)}
          />
          <Input
            isEdit
            name="Password"
            value={'abc34567'}
            hide
            onEdit={() => navigation.navigate('ChangePassword')}
          />
        </View>
      </KeyboardAwareScrollView>

      {isLoading ? <Indicator /> : null}
    </View>
  );
};

export default AccountInfo;
