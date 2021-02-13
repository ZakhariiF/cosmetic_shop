import React from 'react';
import {View, Text} from 'react-native';
import Button from 'components/Button';
import Authheader from 'components/Header/Authheader';
import Header from 'components/Header/Header';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import Indicator from 'components/Indicator';
import {resendEmail} from '../thunks';
import {types} from '../ducks';
import {CommonActions} from '@react-navigation/native';
import {reset} from 'navigation/RootNavigation';

const CheckEmail = ({navigation, route}) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.auth.isResend);

  const {
    params: {email},
  } = route;

  const onResend = () => {
    dispatch(resendEmail(email)).then((response) => {
      if (response.type == types.RESEND_EMAIL_SUCCESS) {
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
      <Header title="CHECK YOUR EMAIL" onBackPress={() => reset('Auth')} />
      <View style={styles.innerContainer}>
        <Text style={styles.heading}>
          Please check your email at the address below and follow the
          instructions to verify your account. {'\n'} If you did not receive an
          email or it expired you can resend one.
        </Text>
        <Text style={styles.emailText}>{email}</Text>
        <Button
          name="Resend my verification email"
          containerStyle={styles.buttonContainer}
          titleStyle={styles.buttonTitle}
          onButtonPress={onResend}
        />
      </View>
      {isLoading ? <Indicator /> : null}
    </View>
  );
};

export default CheckEmail;
