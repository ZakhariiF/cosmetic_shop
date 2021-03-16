import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {Colors, Fonts} from 'constant';

const CheckBox = ({
  title,
  isChecked,
  onPressed,
  containerStyle,
  onLabelClicked,
}) => {
  return onLabelClicked ? (
    <View style={[styles.container, containerStyle || {}]}>
      <TouchableOpacity style={styles.checkBox} onPress={onPressed}>
        {isChecked ? <View style={styles.box} /> : null}
      </TouchableOpacity>
      <TouchableOpacity onPress={onLabelClicked}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <TouchableOpacity
      style={[styles.container, containerStyle || {}]}
      onPress={onPressed}>
      <View style={styles.checkBox}>
        {isChecked ? <View style={styles.box} /> : null}
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

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
  title: {
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
