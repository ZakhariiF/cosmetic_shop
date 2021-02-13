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
import {setIsEdit, setmemberCount} from '../../Booking/thunks';
import Indicator from 'components/Indicator';
import {Colors} from 'constant';
import {cancelAppointment} from '../../thunks';
import {isValidEmail, openMaps} from 'utils';
import {getAppointments} from '../../thunks';

const ApptDetails = ({route, navigation}) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.home.apptLoading);
  const [visible, setVisible] = useState(false);
  const userInfo = useSelector((state) => state.auth.userInfo);

  const {
    params: {past, item},
  } = route;

  const onEdit = () => {
    let tempArr = [
      {
        userType: 'Me',
        date: {
          date: moment(item.DateBookedOffset).format(''),
          time: {
            open: get(
              item.AppointmentTreatments,
              '[0].Treatment.StartDateTimeOffset',
            ),
            close: get(item, 'AppointmentTreatments[0].EndDateTimeOffset'),
          },
        },

        rooms: {roomId: item.Room.ID},
        employees: {employeeId: item.Employee.ID},

        services: {
          Name: item.TreatmentName,
          Price: {Amount: get(item, 'PreOrderFinalTotal.Amount')},
          ...get(item, 'AppointmentTreatments[0]', {}),
        },
        customer: item.Customer,
      },
    ];

    dispatch(setmemberCount(tempArr));
    dispatch(setIsEdit(true));
    navigation.navigate('Book', {screen: 'Review'});
  };

  const onCancel = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    setVisible(false);
    dispatch(cancelAppointment(item.appointment.ID)).then((response) => {
      if (response.type === 'CANCEL_APPT_SUCCESS') {
        navigation.goBack();
        getAppts();
      }
    });
  };

  const getAppts = () =>
    dispatch(getAppointments(get(userInfo, 'profile.bookerId', '')));

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
              label="Confirm"
              onPress={handleCancel}></Dialog.Button>
            {/* <Dialog.Button label="" onPress={handleDelete} /> */}
          </Dialog.Container>
        </View>
        <ScrollView>
          <TouchableOpacity
            onPress={() => openMaps()}
            style={styles.locContainer}>
            <View style={styles.flexContainer}>
              <Text style={styles.headerText}>Location</Text>
              {!past && (
                <TouchableOpacity>
                  <Image source={Images.loc} />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.titleText}>
              Drybar Huntington Beach in Pacific City
            </Text>
          </TouchableOpacity>

          <View style={styles.boxContainer}>
            <Text style={styles.headerText}>Service</Text>
            <Text style={styles.titleText}>
              {get(item, 'TreatmentName')}{' '}
              <Text style={styles.price}>
                (${get(item, 'PreOrderFinalTotal.Amount')})
              </Text>
            </Text>
          </View>

          {get(item, 'AddOnItems').length ? (
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
              {moment(item.StartDateTimeOffset).format('MMMM DD YYYY, h:mma')}
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
              ${get(item, 'FinalTotal.Amount')}
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
