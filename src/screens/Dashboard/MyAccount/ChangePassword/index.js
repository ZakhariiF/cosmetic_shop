import React, {useState} from 'react';
import {View, Text} from 'react-native';
import Button from 'components/Button';
import Authheader from 'components/Header/Authheader';
import Header from 'components/Header/Header';
import Input from 'components/Input';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {forgotpassword} from '../../../Auth/thunks';
import {isValidEmail} from 'utils';
import Indicator from 'components/Indicator';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Dialog from 'react-native-dialog'

const ChangePassword = ({navigation}) => {
  const dispatch = useDispatch();;
  const [email, setEmail] = useState('')
  const [showSuccess, setShowShuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onRecover = () => {
    setLoading(true);
    dispatch(forgotpassword(email)).then((response) => {
      setLoading(false);
      if (response.type === 'RECOVER_PASSWORD_SUCCESS') {
        setShowShuccess(true);
      }
    });
  };

  const isValidate = !isValidEmail(email);

  return (
    <View style={styles.container}>
      <Authheader />
      <Header title="CHANGE PASSWORD" />
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

      <Dialog.Container visible={showSuccess}>
        <Dialog.Title>PASSWORD RESET</Dialog.Title>
        <Dialog.Description>
          We have received your password reset request. if your email matches our records we will send you an password reset link in just a second.
        </Dialog.Description>
        <Dialog.Button
          color="black"
          label="Ok"
          onPress={() => setShowShuccess(false)} />
      </Dialog.Container>

      {loading ? <Indicator /> : null}
    </View>
  );
};

export default ChangePassword;
