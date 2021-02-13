import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Colors, Fonts} from 'constant';
import rootStyle from 'rootStyle';

const Button = ({
  name,
  backgroundColor,
  containerStyle,
  onButtonPress,
  titleStyle,
  disabled,
  isWhite = false,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onButtonPress}
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor || Colors.yellow,
          opacity: disabled ? 0.5 : 1,
        },
        containerStyle,
        isWhite && {backgroundColor: Colors.white},
      ]}>
      <Text
        style={[
          styles.name,
          titleStyle,
          isWhite && {color: Colors.header_title},
        ]}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    ...rootStyle.shadow,
  },
  name: {
    fontSize: 18,
    color: Colors.checkBox,
    fontFamily: Fonts.AvenirNextMedium,
  },
});
