import React, {useState} from 'react';
import {View, Text} from 'react-native';
import Button from 'components/Button';
import Authheader from 'components/Header/Authheader';
import Header from 'components/Header/Header';
import Input from 'components/Input';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {onregister} from '../thunks';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Indicator from 'components/Indicator';
import {CommonActions} from '@react-navigation/native';

const CreatePassword = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const isLoading = useSelector((state) => state.auth.isLoading);

  const {
    params: {email, phone},
  } = route;

  const checkValidate = () => {
    if (
      password.length >= 6 &&
      confirmPassword.length >= 6 &&
      confirmPassword == password
    ) {
      return false;
    } else return true;
  };

  const isDisabled = checkValidate() ? true : false;

  const onSignup = () => {
    dispatch(
      onregister({
        email,
        phone,
        password,
      }),
    ).then((response) => {
      if (response.type === 'REGISTER_SUCCESS') {
        resetAuth();
      }
    });
  };

  const resetAuth = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Auth'}],
      }),
    );
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Authheader />
      <Header title="CREATE A PASSWORD" />
      <KeyboardAwareScrollView>
        <View style={styles.innerContainer}>
          <Text style={styles.heading}>
            Your password must conform to these parameters lorem ipsum
          </Text>
          <Input
            name="Password"
            placeholder="Your password here..."
            value={password}
            onChangeText={(i) => setPassword(i)}
            inputType="Password"
          />

          <Input
            name="Confirm Password"
            placeholder="Your confirm password here..."
            value={confirmPassword}
            onChangeText={(i) => setConfirmPassword(i)}
            inputType="Password"
          />
          <Button
            disabled={isDisabled}
            name="Next"
            containerStyle={{marginTop: 40}}
            onButtonPress={onSignup}
          />
        </View>
      </KeyboardAwareScrollView>
      {isLoading ? <Indicator /> : null}
    </View>
  );
};

export default CreatePassword;
