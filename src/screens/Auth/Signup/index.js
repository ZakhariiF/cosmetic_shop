import React, {useState} from 'react';
import {View, Text} from 'react-native';
import Button from 'components/Button';
import Authheader from 'components/Header/Authheader';
import Header from 'components/Header/Header';
import Input from 'components/Input';
import styles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SocialLogin from 'components/SocialLogin';
import {Images} from 'constant';
import {isValidEmail} from 'utils';

const Signup = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  return (
    <View style={styles.container}>
      <Authheader />
      <Header title="SIGN UP" />
      <KeyboardAwareScrollView>
        <View style={styles.innerContainer}>
          <Input
            name="First Name"
            placeholder="First Name"
            value={firstName}
            onChangeText={(i) => setFirstName(i)}
          />

          <Input
            name="Last Name"
            placeholder="Last Name"
            value={lastName}
            onChangeText={(i) => setLastName(i)}
          />

          <Input
            name="Email"
            placeholder="Email"
            value={email}
            onChangeText={(i) => setEmail(i)}
            keyboardType="email-address"
          />
          <Text style={styles.heading}>You will use this as your log in.</Text>

          <Button
            disabled={!isValidEmail(email) || !firstName || !lastName}
            name="Next"
            containerStyle={{marginTop: 60}}
            onButtonPress={() =>
              navigation.navigate('Phone', {firstName, lastName, email})
            }
          />
          <Text style={styles.recover}>
            Already have an account?{' '}
            <Text
              style={styles.login}
              onPress={() => navigation.navigate('Login')}>
              Log in
            </Text>
          </Text>

          <View style={styles.seprateContainer}>
            <View style={styles.seprator} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.seprator} />
          </View>

          <SocialLogin name="Sign Up with Google" socialImage={Images.google} />
          <SocialLogin name="Sign Up with Facebook" socialImage={Images.fb} />
          <View style={{height: 20}} />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Signup;
