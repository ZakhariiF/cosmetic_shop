import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, Fonts} from 'constant';
import moment from 'moment';
import {get} from 'lodash';

const AppointmentItem = ({
  past = false,
  navigation,
  item,
  onEdit,
  onCancel,
  locationData,
}) => {
  const locationId = get(item, 'appointment.Room.LocationID', 0);

  const location = get(locationData, 'storeCollection.items', []).find(
    (l) => l.bookerLocationId === locationId,
  );

  const timezone = moment()
    .utcOffset(get(item, 'appointment.StartDateTimeOffset'))
    .utcOffset();
  const startTime = moment(
    get(item, 'appointment.StartDateTimeOffset'),
  ).utcOffset(timezone);

  const services = (
    get(item, 'appointment.AppointmentTreatments', []) || []
  ).filter((service) => service.TreatmentName !== 'Extensions');

  const isDifferentTime = services.find(
    (s) =>
      s.StartDateTimeOffset !== get(item, 'appointment.StartDateTimeOffset'),
  );

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.dateContainer,
          past && {backgroundColor: Colors.dimGray},
        ]}>
        <Text style={styles.dateText}>{startTime.format('MMM')}</Text>
        <Text style={[styles.dateText, {fontFamily: Fonts.AvenirNextBold}]}>
          {startTime.format('DD')}
        </Text>
        <Text style={styles.dateText}>{startTime.format('YYYY')}</Text>
        <Text style={[styles.dateText, {fontFamily: Fonts.AvenirNextRegular}]}>
          {startTime.format('hh:mm a')}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text style={styles.locationText}>Location</Text>
            <Text style={styles.location}>
              {location ? location.title : ''}
            </Text>
          </View>

          <View style={styles.rightContainer}>
            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => onEdit(item, location, past)}
              accessible
              accessibilityLabel={past ? 'Rebook' : 'Edit'}
              accessibilityRole="button">
              <Text style={styles.editText}>{past ? 'Rebook' : 'Edit'}</Text>
            </TouchableOpacity>
            {!past && (
              <TouchableOpacity
                style={styles.cancelContainer}
                onPress={() => onCancel(item, location)}
                accessible
                accessibilityLabel="Cancel"
                accessibilityRole="button">
                <Text style={[styles.editText, {color: Colors.header_title}]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={{marginTop: past ? 12 : 0}}>
          <Text style={styles.locationText}>
            {services.length > 1 ? 'Services' : 'Service'}
          </Text>
          <View style={styles.bottomContainer}>
            <View style={{maxWidth: '75%'}}>
              {services.map((service) => (
                <Text style={styles.details}>
                  {get(service, 'TreatmentName', '')} ($
                  {get(service, 'Treatment.Price.Amount')})
                  {isDifferentTime
                    ? moment(service.StartDateTimeOffset)
                        .utcOffset(timezone)
                        .format('hh:mm a')
                    : null}
                </Text>
              ))}
            </View>
            <Text
              onPress={() =>
                navigation.navigate('ApptDetails', {past, item, location})
              }
              accessible
              accessibilityLabel="Appointment Details"
              accessibilityRole="button"
              style={[styles.details, {textDecorationLine: 'underline'}]}>
              View Details
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AppointmentItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 4,
    minHeight: 20,
    maxHeight: 500,
    marginBottom: 30,
  },
  dateContainer: {
    width: '25%',
    backgroundColor: Colors.yellow,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextMedium,
    marginBottom: 2,
  },
  infoContainer: {
    backgroundColor: Colors.white,
    width: '75%',
    borderTopWidth: 1,
    borderTopColor: Colors.seprator,
    padding: '4%',
  },
  locationText: {
    fontSize: 13,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextBold,
  },
  location: {
    fontSize: 15,
    fontFamily: Fonts.AvenirNextRegular,
    marginTop: 4,
    color: Colors.header_title,
  },
  editText: {
    fontSize: 13,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
  },
  details: {
    fontSize: 15,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.header_title,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  cancelContainer: {
    backgroundColor: Colors.white,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.header_title,
  },
  editContainer: {
    backgroundColor: Colors.yellow,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContainer: {
    width: 80,
    elevation: 1,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 0.1,
  },
});
