import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Header from 'components/Header/Header';
import Input from 'components/Input';
import Button from 'components/Button';
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
    get(userInfo, 'firstname', ''),
  );
  const [lastName, setlastName] = useState(
    get(userInfo, 'lastname', ''),
  );
  const [email, setEmail] = useState(get(userInfo, 'preferred_username', ''));
  const [phoneNumber, setphoneNumber] = useState(
    get(userInfo, 'primaryPhone', ''),
  );

  const onUpdate = () => {
    const obj = {
      firstName,
      lastName,
      mobilePhone: phoneNumber,
    };

    dispatch(updateUserInfo(obj)).then((response) => {
      console.log('response>?>?', response);
      if (response.type == 'UPDATE_LOGIN_DETAILS_SUCCESS') {
        navigation.goBack();
      }
    });
  };

  return (
    <View style={[rootStyle.container, styles.container]}>
      <Header title="ACCOUNT INFORMATION" isTab />

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
          <Button onButtonPress={onUpdate} name={"Save"} />
        </View>
      </KeyboardAwareScrollView>

      {isLoading ? <Indicator /> : null}
    </View>
  );
};

export default AccountInfo;
