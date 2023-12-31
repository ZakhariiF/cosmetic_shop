import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {get} from 'lodash';
import {Colors, Fonts} from 'constant';

const PromoInput = ({onApply, promoInfo}) => {
  const [promo, setPromo] = useState(
    get(promoInfo, 'promoCode') || get(promoInfo, 'CouponCode', ''),
  );
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
        disabled={!promo.length}
        accessible={promo.length > 0}
        accessibilityLabel="Apply Coupon Code"
        accessibilityRole="button">
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
