import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Dialog from 'react-native-dialog';

import Button from 'components/Button';
import Authheader from 'components/Header/Authheader';
import Header from 'components/Header/Header';
import Input from 'components/Input';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {forgotpassword, hideReactivationModal, resendEmail} from '../thunks';
import {isValidEmail} from 'utils';
import Indicator from 'components/Indicator';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {CommonActions} from '@react-navigation/native';

const RecoverPassword = ({navigation}) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.auth.forgotLoading);
  const isShowReactivationModal = useSelector(
    (state) => state.auth.isShowReactivationModal,
  );
  const [email, setEmail] = useState('');

  const onRecover = () => {
    dispatch(forgotpassword(email)).then((response) => {
      if (response.type === 'RECOVER_PASSWORD_SUCCESS') {
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

  const onCloseReactivationModal = () => {
    dispatch(hideReactivationModal());
  };

  const onResendEamil = () => {
    dispatch(resendEmail(email));
    dispatch(hideReactivationModal());
  };

  const isValidate = !isValidEmail(email);

  return (
    <View style={styles.container}>
      <Authheader />
      <Header title="RECOVER PASSWORD" />
      <KeyboardAwareScrollView>
        <View style={styles.innerContainer}>
          <Text style={styles.heading}>
            Type your email address in below to get a password reset request
            emailed to you.
          </Text>
          <Input
            name=" "
            placeholder="Your email here..."
            value={email}
            keyboardType="email-address"
            onChangeText={(i) => setEmail(i)}
          />
          <Button
            disabled={isValidate}
            name="Send password reset request"
            containerStyle={{marginTop: 40}}
            onButtonPress={onRecover}
          />
        </View>
      </KeyboardAwareScrollView>

      {isLoading ? <Indicator /> : null}

      <Dialog.Container visible={isShowReactivationModal}>
        <Dialog.Description>
          <Text style={styles.resendActivationModalText}>
            Your account needs to be activated before resetting the password,{' '}
            <Text
              style={styles.resendActivationModalTextLink}
              onPress={onResendEamil}>
              please click here
            </Text>{' '}
            to get an activation email.
          </Text>
        </Dialog.Description>

        <Dialog.Button
          color="black"
          label="OK"
          onPress={onCloseReactivationModal}
        />
      </Dialog.Container>
    </View>
  );
};

export default RecoverPassword;
