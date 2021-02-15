import Button from 'components/Button';
import {Colors, Fonts, Images} from 'constant';
import {get, set} from 'lodash';
import React, {useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import rootStyle from 'rootStyle';
import {openMaps} from 'utils';
import moment from 'moment';

const UpcomingAppts = ({data, navigation, locationData}) => {
  const [today, setToday] = useState(false);

  const renderAppts = ({item}) => {
    const timezone = moment()
      .utcOffset(get(item.appointment, 'StartDateTimeOffset'))
      .utcOffset();
    const startTime = moment(
      get(item.appointment, 'StartDateTimeOffset'),
    ).utcOffset(timezone);

    const locationId = get(item, 'appointment.Customer.LocationID');

    const location = get(locationData, 'storeCollection.items', []).find(l => l.bookerLocationId === locationId);

    return (
      <View style={{marginVertical: 10}}>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>
            {get(
              item.appointment,
              'Customer.LocationName',
              'Drybar Huntington Beach in Pacific City',
            )}
          </Text>

          {get(item, 'appointment.AppointmentTreatments', []).filter((service) => service.TreatmentName !== 'Extensions').map((service) => (
            <View style={styles.clock}>
              <View style={styles.box}>
                <Image source={Images.clock} resizeMode="contain" style={styles.icon} />
                <View>
                  <Text style={styles.infoText}>
                    {startTime.format('hh:mm a')}
                  </Text>
                  <Text style={styles.bottomText} />
                </View>
              </View>
              <View style={styles.box}>
                <Image source={Images.calendar} resizeMode="contain" style={styles.icon} />
                <View>
                  <Text style={styles.infoText}>
                    {startTime.format('DD / MM')}
                  </Text>

                  {!today ? (
                    <Text style={styles.bottomText}>
                      {' '}
                      In {startTime.diff(new Date(), 'days')} days
                    </Text>
                  ) : (
                    <Text style={styles.bottomText}>Today</Text>
                  )}
                  {/* <Text style={styles.bottomText}>in 6 days</Text> */}
                </View>
              </View>
              <View style={[styles.box]}>
                <Image source={Images.blowout} resizeMode="contain" style={styles.icon} />
                <View>
                  <Text style={styles.infoText} numberOfLines={2}>
                    {get(service, 'TreatmentName', 'Blowout')}
                  </Text>
                  <Text style={styles.bottomText}>
                    {get(item, 'appointment.AddOnItems', []).length} add ons
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate('My Appts', {
                screen: 'ApptDetails',
                params: {item, past: false, location},
              })
            }>
            <Text style={styles.editText}>Edit/Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              openMaps(
                get(item.appointment, 'Customer.LocationName'),
                get(location, 'contact.coordinates[0]'),
                get(location, 'contact.coordinates[1]'),
              )
            }>
            <Text style={styles.editText}>Get Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.editButton, {backgroundColor: Colors.yellow}]}>
            <Text style={styles.editText}>Check in</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  let dateToDays = (bookedDate) => {
    let date2days = bookedDate - new Date().getTime();
    var days = Math.floor(date2days / (1000 * 60 * 60 * 24));
    if (days === 0) {
      setToday(true);
    }
    return days;
  };

  const renderEmptyBlock = () => {
    return (
      <View style={[styles.infoContainer, styles.emptyBlock]}>
        <Text style={styles.emptyText}>
          You do not have any {'\n'} upcoming appointments
        </Text>
      </View>
    );
  };
  let arr = [];
  let sort = () => {
    for (let i = 0; i < data?.length; i++) {
      if (
        moment(data[i]?.StartDateTimeOffset).date() > moment(new Date()).date()
      ) {
        console.log('11111111');
        arr.push(data[i]);
      }
    }

    // console.log('hdhdhdhhdhdhdhdhd ' + JSON.stringify(data));
    // data.sort(
    //   (a, b) =>
    //     new Date(a.DateBookedOffset).getDate() -
    //     new Date(b.DateBookedOffset).getDate(),
    // );

    // moment(get(item.appointment, 'DateBookedOffset')).format('hh:mm a')
    // var date1 = moment(data[0].DateBookedOffset).format('hh:mm a');
    // var date2 = moment(new Date()).format('hh:mm a');
    // var diff = date2 - date1;
    // alert(diff);
    // alert(
    //   moment(data[0].DateBookedOffset).format('hh:mm a') >
    //     moment(new Date()).format('hh:mm a'),
    // );
    // alert(
    //   moment(data[0]?.StartDateTimeOffset).format('hh:mm a') <
    //     moment(new Date()).format('hh:mm a'),
    // );
    // alert(data[1].StartDateTimeOffset);

    // alert(
    //   moment(data[0]?.StartDateTimeOffset).format('hh:mm a') +
    //     ' ====time=== ' +
    //     moment(new Date()).format('hh:mm a') +
    //     '  ***   ' +
    //     moment(data[0]?.StartDateTimeOffset).date() +
    //     '  ===date=== ' +
    //     moment(new Date().getDate()),
    // );

    // for (let i = 0; i < data?.length; i++) {
    //   if (
    //     moment(data[i]?.StartDateTimeOffset).format('hh:mm a') >
    //       moment(new Date()).format('hh:mm a') &&
    //     moment(data[i]?.StartDateTimeOffset).date() >
    //       moment(new Date().getDate())
    //   ) {
    //     console.log('11111111');
    //     arr.push(data[i]);
    //   }
    // }
  };
  sort();

  return (
    <View style={styles.container}>
      <Text style={styles.upcoming}>UPCOMING APPOINTMENTS</Text>
      <FlatList
        data={
          data.sort(
            (a, b) =>
              new Date(a.StartDateTimeOffset).getTime() -
              new Date(b.StartDateTimeOffset).getTime(),
          )
          // arr
          // data
          // data.sort(
          //   (a, b) =>
          //     new Date(b.DateBookedOffset).getDate() -
          //     new Date(a.DateBookedOffset).getDate(),
          // )
          // data.sort(
          //   (a, b) =>
          //     new Date(b.DateBookedOffset).getTime() -
          //     new Date(a.DateBookedOffset).getTime(),
          // )
          // &&
          // data.sort(
          //   (
          //     a,
          //     b, // 10:06 PM                          6:01 PM
          //   ) => new Date(a.DateBookedOffset).getTime() >= new Date(),
          // )
        }
        renderItem={renderAppts}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={renderEmptyBlock}
      />
      {!data.length ? (
        <Button
          name="Book an Appointment"
          containerStyle={{marginTop: 30}}
          onButtonPress={() => navigation.navigate('Book')}
        />
      ) : null}
    </View>
  );
};

export default UpcomingAppts;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  upcoming: {
    ...rootStyle.commonText,
    fontFamily: Fonts.Evan,
    lineHeight: 20,
  },
  infoContainer: {
    minHeight: 100,
    maxHeight: 700,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.seprator,
  },
  title: {
    ...rootStyle.commonText,
    alignSelf: 'center',
    marginVertical: 15,
    fontFamily: Fonts.AvenirNextMedium,
  },
  box: {
    height: 100,
    width: '28%',
    backgroundColor: Colors.white,
    borderRadius: 4,
    borderColor: Colors.seprator,
    borderWidth: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  icon: {
    tintColor: Colors.yellow,
    width: 18,
    height: 18,
  },
  infoText: {
    fontSize: 13,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextBold,
    textAlign: 'center',
  },
  bottomText: {
    fontSize: 11,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextItalic,
    textAlign: 'center',
    marginTop: 5,
  },
  clock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 12,
  },
  dryicon: {
    height: 22,
    width: 22,
  },
  editButton: {
    height: 60,
    width: '32%',
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...rootStyle.shadow,
  },
  editText: {
    fontSize: 15,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.header_title,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  emptyBlock: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.empty,
  },
});
