import React from 'react';
import {StyleSheet, TouchableOpacity, Image, Text} from 'react-native';
import {Colors, Fonts} from 'constant';

const SocialLogin = ({socialImage, name}) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Image
        resizeMode="contain"
        style={styles.iconStyle}
        source={socialImage}
      />
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
};

export default SocialLogin;

const styles = StyleSheet.create({
  container: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  iconStyle: {
    left: 0,
    height: 25,
    width: 25,
  },
  name: {
    flex: 1,
    fontSize: 15,
    color: Colors.header_title,
    textAlign: 'center',
    fontFamily: Fonts.AvenirNextRegular,
  },
});
