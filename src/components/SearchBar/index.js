import React from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {Colors, Fonts} from 'constant';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const SearchBar = React.forwardRef((props, ref) => {
  const {
    isButton = true,
    placeholder,
    onSubmitEditing,
    onChangeText,
    value,
    onFocus,
    onChange,
    onSearch,
  } = props;
  return (
    <View style={styles.container}>
      <View style={{width: isButton ? '75%' : '100%'}}>
        <EvilIcons
          name="search"
          size={28}
          style={styles.search}
          color={Colors.header_title}
        />
        <TextInput
          ref={ref}
          value={value}
          style={styles.inputContainer}
          placeholder={placeholder}
          onSubmitEditing={onSubmitEditing}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onChange={onChange}
        />
      </View>
      {isButton ? (
        <TouchableOpacity style={styles.button} onPress={onSearch}>
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
});

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.input_color,
    paddingBottom: 5,
    fontFamily: Fonts.AvenirNextMedium,
    color: Colors.header_title,
    paddingLeft: 30,
    fontSize: 15,
  },
  search: {
    position: 'absolute',
    top: -5,
  },
  button: {
    justifyContent: 'center',
    width: '24%',
    height: 36,
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  searchText: {
    fontSize: 13,
    color: Colors.white,
    fontFamily: Fonts.AvenirNextRegular,
  },
});
