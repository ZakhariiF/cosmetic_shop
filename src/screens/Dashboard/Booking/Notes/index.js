import React, {useState} from 'react';
import {StyleSheet, View, Text, TextInput, ScrollView} from 'react-native';
import Button from 'components/Button';

import {Colors, Fonts} from 'constant';
import rootStyle from 'rootStyle';
import BookingTab from 'components/BookingTab';
import LocationModal from 'components/LocationModal';

import MParticle from 'react-native-mparticle';
import BookingHeader from 'components/BookingHeader';

const Notes = ({navigation, route}) => {
  const [notes, setNotes] = useState(null);

  const onNext = () => {
    MParticle.logEvent('Add Requests', MParticle.EventType.Other, {
      'Source Page': 'Notes',
      Request: notes || '',
    });
    navigation.navigate('ApptHold', {
      Notes: notes,
    });
  };

  return (
    <View style={rootStyle.container}>
      <BookingTab />
      <View style={rootStyle.sizeBox} />
      <BookingHeader
        title="HAVE ANY REQUESTS?"
        safeBackColor={Colors.bg}
        isNext
        onNext={onNext}
      />
      <View style={rootStyle.innerContainer}>
        <ScrollView>
          <Text style={styles.heading}>
            Is it your first time? Anything special we should know about? Would
            you like to request a favorite stylist? While we can’t guarantee it,
            we’ll do our very best to make it happen!
          </Text>

          <View style={styles.seprator} />

          <TextInput
            placeholder="Your request here..."
            style={styles.input}
            multiline
            onChangeText={(text) => setNotes(text)}
          />

          <Button
            name="Next"
            containerStyle={{marginTop: 30, marginBottom: '20%'}}
            onButtonPress={onNext}
          />
        </ScrollView>
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
    height: 150,
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
