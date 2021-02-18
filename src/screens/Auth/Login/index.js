import React, {useState} from 'react';
import {View, Text, BackHandler, Platform, Alert} from 'react-native';
import Button from 'components/Button';
import Authheader from 'components/Header/Authheader';
import Header from 'components/Header/Header';
import Input from 'components/Input';
import styles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MParticle from 'react-native-mparticle';
import SocialLogin from 'components/SocialLogin';
import {Images} from 'constant';
import configFile from 'constant/config';
import {isValidEmail} from 'utils';
import {onlogin, _onlogin} from '../thunks';
import {types} from '../ducks'
import {useDispatch, useSelector} from 'react-redux';
import Indicator from 'components/Indicator';
import axios from 'axios';

import {
  createConfig,
  signIn,
  signOut,
  EventEmitter
} from '@okta/okta-react-native';


// rohit123

const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const [hide, setHide] = useState(true);
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const isloading = useSelector((state) => state.auth.isLoading);
  const [loading, setLoading] = useState(false);
  const isValidate = !isValidEmail(email) || password.length < 6 ? true : false;
  
  const onLogin = async () => {
    MParticle.logEvent('User Attempts to Login', MParticle.EventType.Other, {
      'Source Page': 'Login',
    });

    if (Platform.OS == 'ios') {
      await createConfig({
        clientId: configFile.clientId,
        redirectUri: configFile.redirectUri,
        endSessionRedirectUri: configFile.endSessionRedirectUri,
        discoveryUri: configFile.discoveryUri,
        scopes: configFile.scopes,
        requireHardwareBackedKeyStore: false
      });

      setLoading(true);
      signIn({username: email, password})
      .then(token => {
          dispatch(_onlogin(token, email, password));
        setLoading(false);
      })
      .catch(e => {
        MParticle.logEvent('User fails to Login', MParticle.EventType.Other, {
          'Source Page': 'Login',
          'Error Details': JSON.stringify(e),
          'Email': email,
        });
        console.log(e);
        setLoading(false);
        Alert.alert("Login Error", e.detail.message);
      })
    } else {
      console.log("start logging in********************");
      dispatch(onlogin(email, password));
    }
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
            onPress={() => navigation.navigate('RecoverPassword')}>
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

      {(isloading || loading)  ? <Indicator /> : null}
    </View>
  );
};

export default Login;
