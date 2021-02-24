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
import {
  setExtensionAddon,
  setIsEdit,
  setLocation,
  setmemberCount,
} from '../Booking/thunks';
import moment from 'moment';
import {get} from 'lodash';
import EmptyContainer from 'components/EmptyContainer';
import {storeCollectionQuery} from 'constant/query';
import Dialog from 'react-native-dialog';

import Button from 'components/Button';
import {getUser} from '@okta/okta-react-native';
import {loginSuccess} from 'screens/Auth/thunks';

const MyAppts = ({navigation}) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.home.apptLoading);
  const data = useSelector((state) => state.home.appointments);
  const pastAppt = useSelector((state) => state.home.pastAppt);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const LOCATION_QUERY = storeCollectionQuery();
  const {data: locationData, error, loading} = useQuery(LOCATION_QUERY);

  const [cancelItem, setCancelItem] = useState(null);

  const customerId = get(userInfo, 'bookerID');

  useEffect(() => {
    if (customerId) {
      getAppts();
    } else {
      getUserInfo();
    }
  }, [customerId]);

  const getUserInfo = async () => {
    const user = await getUser();
    dispatch(loginSuccess(user));
  };

  const getAppts = () =>
    dispatch(getAppointments(customerId));

  const onEdit = (item, location, isRebook = false) => {
    const services = get(item, 'appointment.AppointmentTreatments', []).filter(
      (service) => service.TreatmentName !== 'Extensions',
    );

    const extensionData = get(
      item,
      'appointment.AppointmentTreatments',
      [],
    ).find((service) => service.TreatmentName === 'Extensions');

    const checkExtension = (service) => {
      let extension = get(item, 'appointment.AppointmentTreatments', []).find(
        (s) =>
          s.AppointmentID === service.AppointmentID &&
          s.TreatmentName === 'Extensions',
      );

      if (!extension) {
        return (
          get(
            item,
            `appointments.appoint_${service.AppointmentID}.Notes`,
            '',
          ) || ''
        ).includes('Extensions added.');
      }
      return extension;
    };

    let tempArr = services.map((service, idx) => {
      const extension = checkExtension(service);

      return {
        userType: idx === 0 ? 'Me' : 'Guest ' + idx,
        date: {
          date: moment(get(service, 'StartDateTimeOffset')).format(
            'YYYY-MM-DDTHH:mm:ssZ',
          ),
          time: {
            startTime: get(service, 'StartDateTimeOffset'),
            endTime: get(service, 'EndDateTimeOffset'),
            timezone: moment()
              .utcOffset(get(service, 'StartDateTimeOffset'))
              .utcOffset(),
          },
        },

        rooms: get(service, 'RoomID'),
        employees: get(service, 'EmployeeID'),
        services: {
          Name: get(service, 'TreatmentName'),
          Price: {Amount: get(service, 'Treatment.Price.Amount')},
          ...service.Treatment,
        },
        customer: item.Customer,
        extension: extension
          ? {
              price: get(extensionData, 'TagPrice.Amount', 20),
              name: 'Yes',
              room: get(extensionData, 'RoomID'),
              employee: get(extensionData, 'EmployeeID'),
            }
          : undefined,
      };
    });

    dispatch(setLocation(location));
    dispatch(
      setExtensionAddon({
        Name: get(extensionData, 'TreatmentName'),
        Price: {Amount: get(extensionData, 'Treatment.Price.Amount')},
        ...get(extensionData, 'Treatment', {}),
      }),
    );
    dispatch(setmemberCount(tempArr));
    dispatch(
      setIsEdit({
        group: item.groupID,
        appointment: item.appointment.ID,
        oldLocation: location.bookerLocationId,
      }),
    );
    if (isRebook) {
      navigation.navigate('Book', {screen: 'DateTime'});
    } else {
      navigation.navigate('Book', {screen: 'Services'});
    }
  };

  const onCancel = (item, location) => {
    setCancelItem({
      item,
      location,
    });
  };

  const handleCancel = () => {
    const {item, location} = cancelItem;
    if (item) {
      if (!item.groupID) {
        dispatch(cancelAppointment(item.appointment.ID)).then((response) => {
          if (response.type === 'CANCEL_APPT_SUCCESS') {
            getAppts();
          }
        });
      } else {
        dispatch(cancelItinerary(item.groupID, location.bookerLocationId)).then(
          (response) => {
            if (response.type === 'CANCEL_APPT_SUCCESS') {
              getAppts();
            }
          },
        );
      }
    }
    setCancelItem(null);
  };

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
                    key={index}
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
              <Button
                onButtonPress={() => navigation.navigate('Book')}
                name={'Book an Appointment'}
              />
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
