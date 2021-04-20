import React, {useState, useEffect} from 'react';
import {View, Text, BackHandler, Platform, Alert} from 'react-native';
import Button from 'components/Button';
import Authheader from 'components/Header/Authheader';
import Header from 'components/Header/Header';
import Input from 'components/Input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MParticle from 'react-native-mparticle';
import {
  EventEmitter,
  getAuthClient,
  authenticate,
} from '@okta/okta-react-native';

import {isValidEmail} from 'utils';
import {_onlogin} from '../thunks';
import {useDispatch, useSelector} from 'react-redux';

import Indicator from 'components/Indicator';
import styles from './styles';

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const [hide, setHide] = useState(true);
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const isloading = useSelector((state) => state.auth.isLoading);
  const [loading, setLoading] = useState(false);
  const isValidate = !isValidEmail(email) || password.length < 6 ? true : false;

  useEffect(() => {
    const onError = EventEmitter.addListener('onError', (e) => {
      console.log(e);
    });
    return () => {
      onError.remove();
    };
  }, []);

  const onLogin = async () => {
    MParticle.logEvent('User Attempts to Login', MParticle.EventType.Other, {
      'Source Page': 'Login',
    });
    setLoading(true);
    try {
      const transaction = await getAuthClient().signIn({
        username: email,
        password,
      });

      const {status, sessionToken} = transaction;
      if (status === 'PASSWORD_EXPIRED') {
        throw new Error('Please try on browser. Sorry for that.');
      } else if (status !== 'SUCCESS') {
        throw new Error(
          'Transaction status other than "SUCCESS" has been returned. Check transaction.status and handle accordingly.',
        );
      }
      await authenticate({sessionToken});
      dispatch(_onlogin(sessionToken, email, password));
    } catch (e) {
      console.log('Error:', e);
      Alert.alert('Login Error', e.message);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Authheader />
      <Header title="LOG IN" />
      <KeyboardAwareScrollView>
        <View style={styles.innerContainer}>
          <Input
            value={email}
            name="Email"
            onChangeText={(i) => setEmail(i)}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            name="Password"
            placeholder="Your password here..."
            hide={hide}
            onSecure={() => setHide(!hide)}
            onChangeText={(i) => setPassword(i)}
            inputType="Password"
          />

          <Button
            disabled={isValidate}
            name="Login"
            containerStyle={{marginTop: 60}}
            onButtonPress={onLogin}
          />

          <Text
            style={styles.recover}
            onPress={() => navigation.navigate('RecoverPassword')}
            accessible
            accessibilityLabel="Recover Password"
            accessibilityRole="link">
            Recover Password
          </Text>

          {/* <View style={styles.seprateContainer}>
            <View style={styles.seprator} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.seprator} />
          </View> */}

          {/* <SocialLogin name="Log in with Google" socialImage={Images.google} />
          <SocialLogin name="Log in with Facebook" socialImage={Images.fb} /> */}
          <View style={{height: 20}} />
        </View>
      </KeyboardAwareScrollView>

      {isloading || loading ? <Indicator /> : null}
    </View>
  );
};

export default Login;
