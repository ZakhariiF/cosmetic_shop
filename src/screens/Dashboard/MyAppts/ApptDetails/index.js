import React, {useState, useEffect, useCallback} from 'react';
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
import {editOrRebookFromAppointment} from '../../Booking/thunks';
import Indicator from 'components/Indicator';
import {cancelAppointment, cancelItinerary} from '../../thunks';
import {
  openMaps,
  checkExtension,
  getServicesFromAppointment,
  getAddons,
} from 'utils';
import {getAppointments} from '../../thunks';
import * as API from 'services';

const ApptDetails = ({route, navigation}) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.home.apptLoading);
  const [visible, setVisible] = useState(false);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [locationAddons, setAddOns] = useState(null);
  const [addonPrice, setAddonPrice] = useState(0);
  const [serviceAddons, setServiceAddons] = useState([]);

  const {
    params: {past, item, location},
  } = route;

  useEffect(() => {
    getAddonData();
  }, [location]);

  const getAddonData = useCallback(async () => {
    const locationId = get(location, 'bookerLocationId');
    if (locationId) {
      const addonData = await API.findAddonServices({
        LocationID: locationId,
        AddonsOnly: true,
      });
      setAddOns(addonData);
    }
  }, [location]);

  const services = getServicesFromAppointment(item);
  let serviceTotalPrice = 0;
  Object.values(get(item, 'appointments')).forEach((s) => {
    serviceTotalPrice += get(s, 'FinalTotal.Amount', 0);
  });

  useEffect(() => {
    const results = get(locationAddons, 'Results', []);
    if (services.length > 1 && results.length) {
      const tempServiceAddons = [];
      let tempAddonPrice = 0;
      services.forEach((s) => {
        const tempArray = getAddons(
          s,
          item,
          get(locationAddons, 'Results', []),
        );
        tempServiceAddons.push(tempArray);
        tempAddonPrice += tempArray.reduce(
          (s, c) => s + get(c, 'PriceInfo.Amount', 0),
          0,
        );
      });
      setServiceAddons(tempServiceAddons);
      setAddonPrice(tempAddonPrice);
    }
  }, [locationAddons]);

  const timezone = moment()
    .utcOffset(get(item, 'appointment.StartDateTimeOffset'))
    .utcOffset();

  const onEdit = () => {
    dispatch(
      editOrRebookFromAppointment(location, item, past, locationAddons),
    ).then((res) => {
      if (past) {
        navigation.navigate('Book', {screen: 'DateTime'});
      } else {
        navigation.navigate('Book', {screen: 'Services'});
      }
    });
  };

  const onCancel = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    if (item.groupID) {
      dispatch(cancelItinerary(item.groupID, location.bookerLocationId)).then(
        (response) => {
          if (response.type === 'CANCEL_APPT_SUCCESS') {
            navigation.goBack();
            getAppts();
          }
        },
      );
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

  const hasExtension = services
    .map((service) => checkExtension(item, service))
    .filter((e) => !!e);

  const addons = get(item, 'appointment.AddOnItems', []);

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
              label="No"
              onPress={() => setVisible(false)}
            />
            <Dialog.Button color="black" label="Yes" onPress={handleCancel} />
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

          {addons.length ? (
            <View style={styles.boxContainer}>
              <Text style={styles.headerText}>Add-ons</Text>
              {addons.map((a, i) => (
                <Text style={styles.titleText}>
                  {a.Name}{' '}
                  <Text style={styles.price}>
                    (${get(a, 'TagPrice.Amount')})
                  </Text>
                </Text>
              ))}
            </View>
          ) : null}

          {serviceAddons.length > 0 ? (
            <View style={styles.boxContainer}>
              <Text style={styles.headerText}>Add-ons</Text>
              {services.map((s, i) => {
                if (serviceAddons[i].length === 0) {
                  return null;
                }
                return (
                  <View key={i}>
                    <Text>{i === 0 ? 'Me' : `Guest ${i}`}</Text>
                    {serviceAddons[i].map((sA, j) => (
                      <Text style={styles.titleText}>
                        {sA.ServiceName}{' '}
                        <Text style={styles.price}>
                          (${get(sA, 'PriceInfo.Amount')})
                        </Text>
                      </Text>
                    ))}
                  </View>
                );
              })}
            </View>
          ) : null}

          {hasExtension.length > 0 && (
            <View style={styles.boxContainer}>
              <Text style={styles.headerText}>
                {services.length > 1 ? 'Extensions' : 'Extension'}
              </Text>
              {services.map((service, idx) => {
                const extension = checkExtension(item, service);
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
                        (${get(extension, 'Treatment.Price.Amount', 20)})
                      </Text>
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

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
              $
              {serviceTotalPrice +
                addonPrice +
                (services.length > 1
                  ? hasExtension.reduce(
                      (s, e) => s + get(e, 'Treatment.Price.Amount', 20),
                      0,
                    )
                  : 0)}
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
