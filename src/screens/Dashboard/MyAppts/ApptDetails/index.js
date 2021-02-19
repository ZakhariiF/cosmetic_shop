import React, {useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Dialog from 'react-native-dialog';
import Button from 'components/Button';
import Header from 'components/Header/Header';
import {Images} from 'constant';
import rootStyle from 'rootStyle';
import styles from './styles';
import {get} from 'lodash';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {
  setIsEdit,
  setLocation,
  setmemberCount,
  setExtensionAddon,
} from '../../Booking/thunks';
import Indicator from 'components/Indicator';
import {cancelAppointment, cancelItinerary} from '../../thunks';
import {openMaps} from 'utils';
import {getAppointments} from '../../thunks';

const ApptDetails = ({route, navigation}) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.home.apptLoading);
  const [visible, setVisible] = useState(false);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const {
    params: {past, item, location},
  } = route;

  const timezone = moment()
    .utcOffset(get(item, 'appointment.StartDateTimeOffset'))
    .utcOffset();
  const services = get(item, 'appointment.AppointmentTreatments', []).filter(
    (service) => service.TreatmentName !== 'Extensions',
  );

  const extensionData = get(item, 'appointment.AppointmentTreatments', []).find(
    (service) => service.TreatmentName === 'Extensions',
  );

  const checkExtension = (service) => {
    let extension = get(item, 'appointment.AppointmentTreatments', []).find(
      (s) =>
        s.AppointmentID === service.AppointmentID &&
        s.TreatmentName === 'Extensions',
    );

    if (!extension) {
      return (
        get(item, `appointments.appoint_${service.AppointmentID}.Notes`, '') ||
        ''
      ).includes('Extensions added.');
    }

    return extension;
  };

  const onEdit = () => {
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

    if (past) {
      navigation.navigate('Book', {screen: 'DateTime'});
    } else {
      navigation.navigate('Book', {screen: 'Services'});
    }
  };

  const onCancel = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    if (item.groupID) {
      dispatch(cancelItinerary(item.groupID, location.bookerLocationId)).then((response) => {
        if (response.type === 'CANCEL_APPT_SUCCESS') {
          navigation.goBack();
          getAppts();
        }
      });
    } else {
      dispatch(cancelAppointment(item.appointment.ID)).then((response) => {
        if (response.type === 'CANCEL_APPT_SUCCESS') {
          navigation.goBack();
          getAppts();
        }
      });
    }

  };

  const getAppts = () =>
    dispatch(getAppointments(get(userInfo, 'bookerID', '')));

  return (
    <View style={rootStyle.container}>
      <Header title="APPOINTMENT DETAILS" isTab />
      <View style={rootStyle.innerContainer}>
        <View style={styles.dlgCont}>
          <Dialog.Container visible={visible}>
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
              onPress={() => setVisible(false)}
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
        </View>
        <ScrollView>
          <TouchableOpacity
            onPress={() =>
              openMaps(
                get(location, 'title'),
                get(location, 'contact.coordinates[0]'),
                get(location, 'contact.coordinates[1]'),
              )
            }
            style={styles.locContainer}>
            <View style={styles.flexContainer}>
              <Text style={styles.headerText}>Location</Text>
              {!past && (
                <TouchableOpacity>
                  <Image source={Images.loc} />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.titleText}>{get(location, 'title')}</Text>
          </TouchableOpacity>

          <View style={styles.boxContainer}>
            <Text style={styles.headerText}>
              {services.length > 1 ? 'Services' : 'Service'}
            </Text>
            {services.map((service, idx) => (
              <View>
                {services.length > 1 && (
                  <Text>{idx === 0 ? 'Me' : `Guest ${idx}`}</Text>
                )}
                <Text style={styles.titleText}>
                  {get(service, 'TreatmentName')}{' '}
                  <Text style={styles.price}>
                    (${get(service, 'Treatment.Price.Amount')})
                  </Text>
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.boxContainer}>
            <Text style={styles.headerText}>
              {services.length > 1 ? 'Extensions' : 'Extension'}
            </Text>
            {services.map((service, idx) => {
              const extension = checkExtension(service);
              if (!extension) {
                return null;
              }
              return (
                <View>
                  {services.length > 1 && (
                    <Text>{idx === 0 ? 'Me' : `Guest ${idx}`}</Text>
                  )}
                  <Text style={styles.titleText}>
                    Yes
                    <Text style={styles.price}>
                      (${get(service, 'Treatment.Price.Amount')})
                    </Text>
                  </Text>
                </View>
              );
            })}
          </View>

          {get(item, 'appointment.AddOnItems', []).length ? (
            <View style={styles.boxContainer}>
              <Text style={styles.headerText}>Add-ons</Text>
              <Text style={styles.titleText}>
                Liquid Glass <Text style={styles.price}>($10)</Text>
              </Text>
              <Text style={styles.titleText}>
                Scalp Massage <Text style={styles.price}>($10)</Text>
              </Text>
            </View>
          ) : null}

          <View style={styles.boxContainer}>
            <Text style={styles.headerText}>Date & Time</Text>
            <Text style={styles.titleText}>
              {moment(item.appointment.StartDateTimeOffset)
                .utcOffset(timezone)
                .format('MMMM DD YYYY, h:mma')}
            </Text>
          </View>

          {get(item, 'Notes') && (
            <View style={styles.boxContainer}>
              <Text style={styles.headerText}>Notes</Text>
              <Text style={styles.titleText}>I’d like to see Adrian</Text>
            </View>
          )}

          <View style={styles.totalContainer}>
            <Text style={styles.titleText}>
              {!past ? 'Estimated Total *' : 'Total'}
            </Text>
            <Text style={[styles.headerText, styles.price, {fontSize: 18}]}>
              ${get(item, 'appointment.FinalTotal.Amount')}
            </Text>
          </View>

          {past && (
            <Pressable style={{alignSelf: 'flex-end', marginVertical: 5}}>
              <Image source={Images.edit} />
            </Pressable>
          )}

          {past ? (
            <Button
              name="Rebook This Appointment"
              containerStyle={{marginTop: 0}}
              onButtonPress={onEdit}
            />
          ) : (
            <View style={styles.pastButtonContainer}>
              <Button
                name="Cancel"
                containerStyle={styles.cancelButton}
                titleStyle={styles.cancelTitle}
                onButtonPress={onCancel}
              />
              <Button
                name="Edit"
                containerStyle={styles.editButton}
                onButtonPress={onEdit}
              />
            </View>
          )}
        </ScrollView>
      </View>

      {isLoading ? <Indicator /> : null}
    </View>
  );
};

export default ApptDetails;
