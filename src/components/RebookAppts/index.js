import Button from 'components/Button';
import {Colors, Fonts, Images} from 'constant';
import {get} from 'lodash';
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import rootStyle from 'rootStyle';
import {openMaps} from 'utils';

const RebookAppts = ({item, onRebook, locationData}) => {
  const locationId = get(item.appointment, 'Room.LocationID', 0)

  const location = get(locationData, 'storeCollection.items', []).find(l => l.bookerLocationId === locationId)

  return (
    <View style={styles.container}>
      <Text style={styles.upcoming}>REBOOK LAST APPOINTMENT?</Text>
      <View style={[styles.infoContainer]}>
        <View style={styles.bottomContainer}>
          <Image
            resizeMode="contain"
            source={Images.rebook}
            style={styles.serviceIcon}
          />
          <Text style={styles.blowout}>{get(item.appointment, 'TreatmentName')}</Text>
        </View>
        <Text style={styles.messsage}>with scalp massage</Text>
        <TouchableOpacity
          onPress={openMaps}
          style={[styles.bottomContainer, {marginTop: 40}]}>
          <Text style={styles.location}>
            {get(location, 'title')}
          </Text>
          <Image source={Images.loc} />
        </TouchableOpacity>
      </View>

      <Button
        name="Rebook"
        containerStyle={{marginTop: 30}}
        onButtonPress={() => onRebook(item, location)}
      />
    </View>
  );
};

export default RebookAppts;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  upcoming: {
    ...rootStyle.commonText,
    fontFamily: Fonts.Evan,
    marginBottom: 10,
    lineHeight: 20,
  },
  infoContainer: {
    height: 200,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.seprator,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blowout: {
    fontSize: 24,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextMedium,
    marginLeft: 10,
  },
  messsage: {
    ...rootStyle.commonText,
    fontSize: 18,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    ...rootStyle.commonText,
    fontFamily: Fonts.AvenirNextMedium,
    marginRight: 10,
  },
  serviceIcon: {
    position: 'absolute',
    top: '-120%',
    right: '31%',
  },
});
