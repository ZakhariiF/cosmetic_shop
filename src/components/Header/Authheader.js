import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {Colors, Fonts, Images} from 'constant';
import {call} from 'utils';

const Authheader = ({isCall}) => (
  <View style={styles.container}>
    <View style={styles.leftContainer} />
    <Image
      resizeMode="contain"
      source={Images.welcome_logo}
      style={styles.logo}
    />
    {isCall ? (
      <TouchableOpacity
        onPress={() => call('888-555-1212')}
        style={styles.rightContainer}>
        <Image source={Images.call} />
        <Text style={styles.call}>Call Us</Text>
      </TouchableOpacity>
    ) : (
      <View style={styles.leftContainer} />
    )}
  </View>
);

export default Authheader;

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    flexDirection: 'row',
  },
  logo: {
    height: '80%',
    width: '60%',
  },
  call: {
    fontSize: 13,
    fontFamily: Fonts.AvenirNextRegular,
    marginLeft: 8,
    color: Colors.header_title,
  },
  rightContainer: {
    width: '20%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: '8%',
  },
  leftContainer: {
    width: '20%',
  },
});
