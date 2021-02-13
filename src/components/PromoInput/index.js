import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {Colors, Fonts} from 'constant';

const PromoInput = ({onApply}) => {
  const [promo, setPromo] = useState('');
  return (
    <View style={styles.container}>
      <View style={{width: '75%'}}>
        <TextInput
          value={promo}
          style={styles.inputContainer}
          placeholder="Promo Code"
          onChangeText={(e) => setPromo(e)}
        />
      </View>
      <TouchableOpacity
        onPress={() => onApply(promo)}
        style={[styles.button, {opacity: promo.length ? 1 : 0.8}]}
        disabled={!promo.length}>
        <Text style={styles.searchText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PromoInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.input_color,
    paddingBottom: 5,
    fontFamily: Fonts.AvenirNextItalic,
    color: Colors.header_title,
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
