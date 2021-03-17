import React, {useState, useEffect} from 'react';
import {View, Text, BackHandler, Platform, Alert} from 'react-native';
import Button from 'components/Button';
import Authheader from 'components/Header/Authheader';
import Header from 'components/Header/Header';
import Input from 'components/Input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MParticle from 'react-native-mparticle';
import {signIn, EventEmitter} from '@okta/okta-react-native';

import {isValidEmail} from 'utils';
import {onlogin, _onlogin} from '../thunks';
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
    }
  }, []);

  const onLogin = async () => {
    MParticle.logEvent('User Attempts to Login', MParticle.EventType.Other, {
      'Source Page': 'Login',
    });

    // if (Platform.OS === 'ios') {
    setLoading(true);
    signIn({username: email, password})
      .then((token) => {
        console.log('Token:', token);
        dispatch(_onlogin(token, email, password));
        setLoading(false);
      })
      .catch((e) => {
        MParticle.logEvent('User fails to Login', MParticle.EventType.Other, {
          'Source Page': 'Login',
          'Error Details': JSON.stringify(e),
          Email: email,
        });
        console.log(e);
        setLoading(false);
        Alert.alert('Login Error', e.detail.message);
      });
    // } else {
    //   console.log('start logging in********************');
    //   dispatch(onlogin(email, password));
    // }
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

      {isloading || loading ? <Indicator /> : null}
    </View>
  );
};

export default Login;
