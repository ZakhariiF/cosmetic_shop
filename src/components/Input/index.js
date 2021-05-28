import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors, Fonts} from 'constant';
import Entypo from 'react-native-vector-icons/Entypo';

const Input = ({
  name,
  placeholder,
  // hide,
  // onSecure,
  isEdit,
  value,
  onEdit,
  onChangeText,
  keyboardType,
  autoCapitalize,
  returnKeyType,
  inputType,
  multiline,
  containerStyle,
  labelStyle,
  inputName,
}) => {
  const input = useRef(null);
  const [hide, setHide] = useState(true);
  if (isEdit) {
    return (
      <>
        {name && <Text style={[styles.name, labelStyle]}>{name}</Text>}
        <View style={styles.inputContainer}>
          <TextInput
            ref={input}
            value={value}
            multiline={multiline}
            placeholder={placeholder}
            style={[
              styles.inputContainer,
              {borderBottomWidth: 0, width: '88%'},
            ]}
            secureTextEntry={name === 'Password'}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize || 'none'}
            returnKeyType={returnKeyType}
            name={inputName || name}
          />
          <Text
            accessible
            accessibilityLabel="Edit"
            accessibilityRole="button"
            onPress={() => {
              input.current.focus();
              onEdit && onEdit();
            }}
            style={[styles.eyeIcon, styles.edit]}>
            Edit
          </Text>
        </View>
      </>
    );
  }
  if (inputType === 'Password') {
    return (
      <>
        {name ? <Text style={[styles.name, labelStyle]}>{name}</Text> : null}
        <View style={styles.inputContainer}>
          <TextInput
            value={value}
            placeholder={placeholder}
            style={[
              styles.inputContainer,
              {borderBottomWidth: 0, width: '88%'},
            ]}
            secureTextEntry={hide}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize || 'none'}
            returnKeyType={returnKeyType}
            name={inputName || name}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            accessible
            accessibilityLabel="Hide"
            accessibilityRole="button"
            onPress={() => setHide(!hide)}>
            <Entypo
              name={!hide ? 'eye' : 'eye-with-line'}
              size={25}
              color={Colors.input_text}
            />
          </TouchableOpacity>
        </View>
      </>
    );
  }
  return (
    <>
      {name && <Text style={[styles.name, labelStyle]}>{name}</Text>}
      <TextInput
        value={value}
        multiline={multiline}
        placeholder={placeholder}
        style={[styles.inputContainer, containerStyle]}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize || 'none'}
        returnKeyType={returnKeyType}
        name={inputName || name}
      />
    </>
  );
};

export default Input;
const styles = StyleSheet.create({
  name: {
    fontSize: 15,
    color: Colors.light_gray,
    marginTop: 25,
    fontFamily: Fonts.AvenirNextRegular,
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.input_color,
    fontSize: 18,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.input_text,
    marginTop: 10,
    paddingBottom: 4,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  edit: {
    fontSize: 13,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.edit_text,
  },
});
