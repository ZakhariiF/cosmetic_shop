import {Colors, Fonts, Images} from 'constant';
import React from 'react';
import {Text, StyleSheet, Image, Platform} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const NativePicker = ({
  error,
  items,
  onValueChange,
  selectedValue,
  placeholder,
  nonParent,
  disabled,
  pickerContainer,
}) => {

  let styleObj = {
    viewContainer: [styles.pickerContainer, pickerContainer],
    placeholder: {
      color: Colors.light_gray,
      fontFamily: Fonts.AvenirNextRegular,
      fontSize: 16,
    },
  };

  if (Platform.OS === 'android') {
    styleObj = {
      ...styleObj,
      inputAndroid: styles.pickerinput,
      inputAndroidContainer: {justifyContent: 'center'},
    }
  } else {
    styleObj = {
      ...styleObj,
      inputIOS: styles.pickerinput,
      inputIOSContainer: {justifyContent: 'center'},
    }
  }

  return (
    <RNPickerSelect
      // disabled={!!disabled}
      style={styleObj}
      Icon={() => (
        <Image
          resizeMode="contain"
          source={Images.down_arrow}
          style={styles.arrowIcon}
        />
      )}
      onValueChange={(value) => onValueChange(value)}
      value={selectedValue}
      items={items}
    />
  );
};

export default NativePicker;

const styles = StyleSheet.create({
  pickerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.input_color,
    fontSize: 18,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.input_text,
    marginTop: 10,
    paddingBottom: 4,
    height: 50,
    paddingHorizontal: 2,
  },
  pickerinput: {
    height: '100%',
    fontSize: 18,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.input_text,
  },
  arrowIcon: {
    height: 15,
    width: 15,
  },
  error: {
    fontSize: 12,
    fontFamily: Fonts.AvenirNextRegular,
    color: 'red',
    marginTop: 10,
    marginLeft: 10,
  },
});
