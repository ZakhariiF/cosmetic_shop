import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {Colors, Fonts, Images} from 'constant';

const Welcome = ({navigation}) => {
  return (
    <ImageBackground
      resizeMode="cover"
      source={Images.bg}
      style={styles.container}>
      <Image
        resizeMode="contain"
        style={styles.logo}
        source={Images.welcome_logo}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          accessible
          accessibilityLabel="Log in"
          accessibilityRole="link"
          style={[styles.loginContainer, {backgroundColor: Colors.yellow}]}>
          <Text style={[styles.buttonText, {color: Colors.header_title}]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessible
          accessibilityLabel="Sign Up"
          accessibilityRole="link"
          onPress={() => navigation.navigate('Signup')}
          style={[
            styles.loginContainer,
            {backgroundColor: Colors.white, marginTop: 15},
          ]}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logo: {
    width: '80%',
    height: '20%',
    alignSelf: 'center',
  },
  buttonContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.input_text,
  },
});
