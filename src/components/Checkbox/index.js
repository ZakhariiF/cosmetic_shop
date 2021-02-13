import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {Colors, Fonts} from 'constant';

const CheckBox = ({titile, isChecked, onPressed}) => (
  <TouchableOpacity style={styles.container} onPress={onPressed}>
    <View style={styles.checkBox}>
      {isChecked ? <View style={styles.box} /> : null}
    </View>
    <Text style={styles.titile}>{titile}</Text>
  </TouchableOpacity>
);

export default CheckBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  checkBox: {
    height: 15,
    width: 15,
    borderWidth: 1,
    borderColor: Colors.checkBox,
    padding: 1.5,
  },
  titile: {
    fontSize: 15,
    color: Colors.header_title,
    marginLeft: 15,
    fontFamily: Fonts.AvenirNextRegular,
  },
  box: {
    backgroundColor: Colors.checkBox,
    height: '100%',
    width: '100%',
  },
});
