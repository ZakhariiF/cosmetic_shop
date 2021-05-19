import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, ScrollView, RefreshControl} from 'react-native';
import Header from 'components/Header/Header';
import rootStyle from 'rootStyle';
import AppointmentItem from './AppointmentItem';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {useQuery} from '@apollo/client';
import Indicator from 'components/Indicator';
import {cancelAppointment, getAppointments, cancelItinerary} from '../thunks';
import {editOrRebookFromAppointment} from '../Booking/thunks';

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
  const [showConfirm, setShowConfirm] = useState(false);

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

  const getAppts = () => dispatch(getAppointments(customerId));

  const onEdit = (item, location, isRebook = false) => {
    dispatch(editOrRebookFromAppointment(location, item, isRebook)).then(
      (res) => {
        if (isRebook) {
          navigation.navigate('Book', {screen: 'DateTime'});
        } else {
          navigation.navigate('Book', {screen: 'Services'});
        }
      },
    );
  };

  const onCancel = (item, location) => {
    let type = 1;

    if (
      moment(get(item, 'appointment.StartDateTimeOffset')).diff(
        moment(),
        'hours',
        true,
      ) < 2
    ) {
      type = 2;
    }
    setCancelItem({
      item,
      location,
      type,
    });
    setShowConfirm(true);
  };

  const handleCancel = () => {
    const {item, location, type} = cancelItem;
    if (item) {
      if (!item.groupID) {
        dispatch(cancelAppointment(item.appointment.ID, type)).then(
          (response) => {
            if (response.type === 'CANCEL_APPT_SUCCESS') {
              getAppts();
            }
          },
        );
      } else {
        dispatch(
          cancelItinerary(item.groupID, location.bookerLocationId, type),
        ).then((response) => {
          if (response.type === 'CANCEL_APPT_SUCCESS') {
            getAppts();
          }
        });
      }
    }
    setShowConfirm(false);
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
              <Text style={styles.upcomingText}>UPCOMING APPOINTMENTS </Text>
              <FlatList
                // scrollEnabled={false}
                data={data.sort(
                  (a, b) =>
                    new Date(a.appointment.StartDateTimeOffset).getTime() -
                    new Date(b.appointment.StartDateTimeOffset).getTime(),
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
              <Text style={styles.upcomingText}>
                PAST APPOINTMENTS {'\n'}(showing only past 3 months)
              </Text>
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
              <EmptyContainer emptyText="You do not have any upcoming appointments." />
              <EmptyContainer emptyText="Book a new appointment, or easily rebook from one of your past visits." />
              <Button
                onButtonPress={() => navigation.navigate('Book')}
                name={'Book an Appointment'}
              />
            </View>
          ) : null}

          <Dialog.Container visible={showConfirm}>
            <Dialog.Title>Cancel Appointment</Dialog.Title>
            <Dialog.Description>
              {get(cancelItem, 'type', 1) === 2
                ? "Oh no Buttercup, it looks like you're canceling within 2 hours of your appointment. If you continue, you'll be charged a late cancelation fee. (Sorry!)"
                : 'Are you sure you want to cancel?'}
            </Dialog.Description>

            <Dialog.Button
              color="black"
              label="No"
              onPress={() => setShowConfirm(false)}
            />
            <Dialog.Button color="black" label="Yes" onPress={handleCancel} />
          </Dialog.Container>
        </ScrollView>
      </View>
      {isLoading ? <Indicator /> : null}
    </View>
  );
};

export default MyAppts;
