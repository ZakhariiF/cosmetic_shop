import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, ScrollView, RefreshControl} from 'react-native';
import Header from 'components/Header/Header';
import rootStyle from 'rootStyle';
import AppointmentItem from './AppointmentItem';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {useQuery} from '@apollo/client';
import Indicator from 'components/Indicator';
import {cancelAppointment, getAppointments, cancelItinerary} from '../thunks';
import {setIsEdit, setLocation, setmemberCount} from '../Booking/thunks';
import moment from 'moment';
import {get} from 'lodash';
import EmptyContainer from 'components/EmptyContainer';
import {storeCollectionQuery} from 'constant/query';
import Dialog from 'react-native-dialog';

import Button from 'components/Button';

const MyAppts = ({navigation}) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.home.apptLoading);
  const data = useSelector((state) => state.home.appointments);
  const pastAppt = useSelector((state) => state.home.pastAppt);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const LOCATION_QUERY = storeCollectionQuery();
  const {data: locationData, error, loading} = useQuery(LOCATION_QUERY);

  const [cancelItem, setCancelItem] = useState(null)

  useEffect(() => {
    getAppts();
  }, []);

  const getAppts = () =>
    dispatch(getAppointments(get(userInfo, 'profile.bookerId', '')));

  const onEdit = (item, location) => {
    let tempArr = get(item, 'appointment.AppointmentTreatments', [])
      .filter((service) => service.TreatmentName !== 'Extensions')
      .map(
      (service, index) => {
        const timezone = moment()
          .utcOffset(service.StartDateTimeOffset)
          .utcOffset();
        const startTime = moment(service.StartDateTimeOffset).utcOffset(
          timezone,
        );
        const endTime = moment(service.EndDateTimeOffset).utcOffset(timezone);
        return {
          userType: index === 0 ? 'Me' : `Guest ${index}`,
          date: {
            date: moment(service.StartDateTimeOffset).format(''),
            time: {
              startTime: startTime.format('YYYY-MM-DDTHH:mm:ssZ'),
              endTime: endTime.format('YYYY-MM-DDTHH:mm:ssZ'),
              timezone,
            },
          },
          rooms: service.RoomID,
          employees: service.EmployeeID,
          services: {
            Name: service.TreatmentName,
            Price: {Amount: get(service, 'TagPrice.Amount')},
            ...service,
          },
          customer: item.Customer,
        };
      },
    );

    dispatch(setLocation(location));

    dispatch(setmemberCount(tempArr));
    dispatch(
      setIsEdit({
        group: item.groupID,
        appointment: item.appointment.ID,
        oldLocation: location.bookerLocationId,
      }),
    );

    navigation.navigate('Book', {screen: 'Services'});
  };

  const onCancel = (item, location) => {
    setCancelItem({
      item, location,
    });
  };

  const handleCancel = () => {
    const {item, location} = cancelItem
    if (!item.groupID) {
      dispatch(cancelAppointment(item.appointment.ID));
    } else {
      dispatch(cancelItinerary(item.groupID, location.bookerLocationId));
    }
  }

  return (
    <View style={rootStyle.container}>
      <Header isBack={false} isTab title="MY APPOINTMENTS" />
      <View style={rootStyle.innerContainer}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={getAppts} />
          }
          nestedScrollEnabled>
          {data.length ? (
            <View>
              <Text style={styles.upcomingText}>Upcoming</Text>
              <FlatList
                // scrollEnabled={false}
                data={data.sort(
                  (a, b) =>
                    new Date(b.appointment.DateBookedOffset) -
                    new Date(a.appointment.DateBookedOffset),
                )}
                renderItem={({item}) => (
                  <AppointmentItem
                    navigation={navigation}
                    item={item}
                    onEdit={onEdit}
                    onCancel={onCancel}
                    locationData={locationData}
                  />
                )}
                keyExtractor={(_, index) => index.toString()}
              />
            </View>
          ) : null}

          {pastAppt.length ? (
            <>
              <Text style={styles.upcomingText}>Past</Text>
              <FlatList
                data={pastAppt.sort(
                  (a, b) =>
                    new Date(b.DateBookedOffset) - new Date(a.DateBookedOffset),
                )}
                scrollEnabled={false}
                renderItem={({item, index}) => (
                  <AppointmentItem
                    past={true}
                    navigation={navigation}
                    item={item}
                    onEdit={onEdit}
                    locationData={locationData}
                  />
                )}
                keyExtractor={(_, index) => index.toString()}
              />
            </>
          ) : null}

          {!data.length && !pastAppt.length ? (
            <View style={styles.emptyContainer}>
              <EmptyContainer emptyText="You do not have any upcoming appointments" />
              <EmptyContainer emptyText="Book on from here or easily rebook from one of your previous visits" />
              <Button onButtonPress={() => navigation.navigate('Book')} name={"Book an Appointment"} />
            </View>
          ) : null}

          <Dialog.Container visible={cancelItem}>
            <Dialog.Title>Cancel Appointment</Dialog.Title>
            <Dialog.Description>
              Are you sure you want to cancel?
            </Dialog.Description>

            <Dialog.Button
              color="black"
              style={
                {
                  // backgroundColor: Colors.dimGray,
                }
              }
              label="Cancel"
              onPress={() => setCancelItem(null)}
            />
            <Dialog.Button
              color="black"
              style={
                {
                  // backgroundColor: Colors.dimGray,
                }
              }
              label="Confirm"
              onPress={handleCancel}
            />


            {/* <Dialog.Button label="" onPress={handleDelete} /> */}
          </Dialog.Container>
        </ScrollView>
      </View>
      {isLoading ? <Indicator /> : null}
    </View>
  );
};

export default MyAppts;
