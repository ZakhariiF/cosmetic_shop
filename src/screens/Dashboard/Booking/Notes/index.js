import React, {useState} from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import Button from 'components/Button';
import Header from 'components/Header/Header';
import {Colors, Fonts} from 'constant';
import rootStyle from 'rootStyle';
import BookingTab from 'components/BookingTab';
import LocationModal from 'components/LocationModal';
import {setmemberCount} from '../thunks';
import {useSelector, useDispatch} from 'react-redux';

const Notes = ({navigation, route}) => {
  const dispatch = useDispatch();
  const totalGuests = useSelector((state) => state.booking.totalGuests);
  const [notes, setNotes] = useState();
  return (
    <View style={rootStyle.container}>
      <BookingTab />
      <View style={rootStyle.sizeBox} />
      <Header title="HAVE ANY REQUESTS?" safeBackColor={Colors.bg} />
      <View style={rootStyle.innerContainer}>
        <Text style={styles.heading}>
          Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus
          accumsan et viverra justo commodo.
        </Text>

        <View style={styles.seprator} />

        <TextInput
          placeholder="Your request here..."
          style={styles.input}
          multiline
          onChangeText={(text) => setNotes(text)}
          blurOnSubmit={true}
        />

        <Button
          name="Next"
          containerStyle={{marginTop: 30}}
          onButtonPress={() => {
            // let tempArr = [...totalGuests];
            // tempArr.push({Notes: notes});
            // dispatch(setmemberCount(tempArr));
            navigation.navigate('ApptHold', {
              Notes: notes,
            });
          }}
        />
      </View>
      <LocationModal />
    </View>
  );
};

export default Notes;

const styles = StyleSheet.create({
  heading: {
    fontSize: 15,
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: Fonts.AvenirNextRegular,
    marginTop: 10,
    color: Colors.header_title,
  },
  seprator: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.seprator,
    marginTop: 20,
  },
  input: {
    height: '35%',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.seprator,
    marginTop: 25,
    fontFamily: Fonts.AvenirNextItalic,
    paddingTop: 10,
    backgroundColor: Colors.white,
    paddingHorizontal: 15,
    width: '95%',
    alignSelf: 'center',
  },
});
