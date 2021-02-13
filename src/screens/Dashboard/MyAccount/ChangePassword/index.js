import React, {useState} from 'react';
import {Image, Text, View} from 'react-native';
import Button from 'components/Button';
import Header from 'components/Header/Header';
import Input from 'components/Input';
import {Images} from 'constant';
import rootStyle from 'rootStyle';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import Indicator from 'components/Indicator';
import {get} from 'lodash';
import {updatePassword} from 'screens/Auth/thunks';
import {types} from 'screens/Auth/ducks';
import {AlertHelper} from 'utils/AlertHelper';

const ChangePassword = ({navigation}) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isLoading = useSelector((state) => state.auth.isPasswordLoading);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const checkValidate = () => {
    if (
      oldPassword &&
      newPassword.length >= 6 &&
      confirmPassword.length >= 6 &&
      confirmPassword == newPassword
    ) {
      return false;
    } else return true;
  };

  const onChangePassword = () => {
    dispatch(
      updatePassword(get(userInfo, 'sub'), {oldPassword, newPassword}),
    ).then((reseponse) => {
      if (reseponse.type === types.CHANGE_PASSWORD_SUCCESS) {
        navigation.goBack();
        AlertHelper.showSuccess('Password changed succesfully');
      }
    });
  };

  return (
    <View style={rootStyle.container}>
      <Header title="CHANGE PASSWORD" isTab />
      <View style={rootStyle.innerContainer}>
        <Input
          name="Current Password"
          inputType="Password"
          placeholder="Current Password"
          value={oldPassword}
          onChangeText={(i) => setOldPassword(i)}
        />
        <View style={styles.spaceBox} />
        <Input
          inputType="Password"
          placeholder="New Password"
          value={newPassword}
          onChangeText={(i) => setNewPassword(i)}
        />
        <View style={styles.warning}>
          <Image source={Images.warn} style={{marginTop: 2.5}} />
          <Text style={styles.warnText}>
            Password rules will go here lorem ipsum dolor interdum et malesuada
            fames ac ante ipsum primis into faucibus. In congue augue lorem.
          </Text>
        </View>
        <View style={styles.spaceBox} />
        <Input
          inputType="Password"
          placeholder="Confirm New Password"
          onChangeText={(i) => setConfirmPassword(i)}
          onSecure={() => setConfirmPasswordHide(!confirmPassword)}
        />

        <Button
          name="Save"
          containerStyle={{marginTop: 50}}
          disabled={checkValidate()}
          onButtonPress={onChangePassword}
        />
      </View>
      {isLoading ? <Indicator /> : null}
    </View>
  );
};

export default ChangePassword;
