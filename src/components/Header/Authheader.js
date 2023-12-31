import React from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import {get} from 'lodash';
import {Colors, Fonts, Images} from 'constant';
import {call} from 'utils';
import {useSelector} from 'react-redux';

const Authheader = ({isCall}) => {
  const config = useSelector((state) => state.home.config);

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer} />
      <Image
        resizeMode="contain"
        source={Images.welcome_logo}
        style={styles.logo}
      />
      {isCall ? (
        <TouchableOpacity
          onPress={() => call(get(config, 'settings.phoneNumbers.drybarServices'))}
          accessible
          accessibilityLabel="Call Us"
          accessibilityRole="link"
          style={styles.rightContainer}>
          <Image source={Images.call} />
          <Text style={styles.call}>Call Us</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.leftContainer} />
      )}
    </View>
  );
};

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
