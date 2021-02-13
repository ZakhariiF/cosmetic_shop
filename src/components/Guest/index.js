import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors, Fonts} from 'constant';
import Entypo from 'react-native-vector-icons/Entypo';
import Button from '../Button';

const Guest = ({count, onDecrement, onIncrement, onNext, navigation}) => {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.header}>How Many Guests?</Text>
        <Text style={styles.notice}>You may book up to 4 guests.</Text>

        <View style={styles.countContainer}>
          <TouchableOpacity style={styles.circle} onPress={onDecrement}>
            <Entypo name="minus" color={Colors.primary} size={14} />
          </TouchableOpacity>

          <Text style={styles.count}>{count}</Text>
          <TouchableOpacity style={styles.circle} onPress={onIncrement}>
            <Entypo name="plus" color={Colors.primary} size={16} />
          </TouchableOpacity>
        </View>
      </View>
      <Button name="Next" onButtonPress={onNext} />

      <Text
        onPress={() => navigation.navigate('BookingForm')}
        style={styles.bottomText}>
        I want to book more than 4
      </Text>
    </>
  );
};

export default Guest;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  header: {
    fontSize: 18,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.header_title,
  },
  notice: {
    fontSize: 15,
    fontFamily: Fonts.AvenirNextItalic,
    color: Colors.header_title,
    marginTop: 10,
  },
  circle: {
    height: 33,
    width: 33,
    borderRadius: 33 / 2,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    fontSize: 26,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextMedium,
  },
  countContainer: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  bottomText: {
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
    alignSelf: 'center',
    textDecorationLine: 'underline',
  },
});
