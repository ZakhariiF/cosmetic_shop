import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import MParticle from 'react-native-mparticle';

import rootStyle from 'rootStyle';
import Authheader from 'components/Header/Authheader';

import UpcomingAppts from 'components/UpcomingAppts';
import {Images} from 'constant';
import StyleSwiper from 'components/StyleSwiper';
import RebookAppts from 'components/RebookAppts';
import {
  cancelAppointment,
  cancelItinerary,
  getAppointments,
  setGlobalConfig,
} from '../thunks';
import {useDispatch, useSelector} from 'react-redux';
import Indicator from 'components/Indicator';
import {get} from 'lodash';
import {getCustomerInfo, loginSuccess} from 'screens/Auth/thunks';
import {gqlLoadHome} from 'constant/contentfulHomeActions';
import {getGlobalConfig} from 'constant/contentfulActions';
import {
  getLocations,
  setExtensionAddon,
  setIsEdit,
  setLocation,
  setmemberCount,
} from '../Booking/thunks';
import moment from 'moment';
import {storeCollectionQuery} from 'constant/query';
import {useQuery} from '@apollo/client';
import {getUser} from '@okta/okta-react-native';
import Dialog from 'react-native-dialog';
import {hasRadarPermission, trigerListener} from 'utils/RadarHelper';

import styles from './styles';

const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.home.apptLoading);
  const upcomingAppt = useSelector((state) => state.home.appointments);
  const pastAppt = useSelector((state) => state.home.pastAppt);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [homeData, setHomeData] = useState([]);
  const [backpermission, setbackpermission] = useState(false);
  const LOCATION_QUERY = storeCollectionQuery();
  const {data, error, loading} = useQuery(LOCATION_QUERY);
  const customerId = get(userInfo, 'bookerID');
  const [deleteItem, setDeleteItem] = useState(null);

  const globalConfig = useSelector((state) => state.home.config);

  useEffect(() => {
    if (!globalConfig) {
      getConfig();
    }
  }, [globalConfig]);

  const getConfig = async () => {
    const configData = await getGlobalConfig();
    if (configData) {
      dispatch(setGlobalConfig(configData));
    }
  };

  React.useMemo(() => {
    if (loading || error) {
      return null;
    }

    dispatch(getLocations(data.storeCollection.items));
    return data;
  }, [loading, error, data]);

  useEffect(() => {
    if (customerId) {
      getAppts();
      getCustomerDetails();
      getHomeData();
    } else {
      getUserInfo();
    }
  }, []);

  const getUserInfo = async () => {
    const user = await getUser();
    dispatch(loginSuccess(user));
  };

  const getCustomerDetails = () => dispatch(getCustomerInfo(customerId));

  const getAppts = () =>
    dispatch(getAppointments(customerId, 10, moment().format('YYYY-MM-DD')));

  const getHomeData = async () => {
    try {
      const d = await gqlLoadHome();
      setHomeData(d);
    } catch (error) {}
  };

  const onEdit = (item, location, past) => {
    const services = get(item, 'appointment.AppointmentTreatments', []).filter(
      (service) => service.TreatmentName !== 'Extensions',
    );

    MParticle.logEvent('Home - Rebook', MParticle.EventType.Navigation, {
      'Source Page': 'Home',
      'Book Type': 'Rebook',
    });

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

    if (past) {
      navigation.navigate('Book', {screen: 'DateTime'});
    } else {
      navigation.navigate('Book', {screen: 'Services'});
    }
  };

  const onCancel = (item, location) => {
    setDeleteItem({
      item,
      location,
    });
  };

  const handleCancel = () => {
    if (!deleteItem) {
      return;
    }
    const {item, location} = deleteItem;
    if (item.groupID) {
      dispatch(cancelItinerary(item.groupID, location.bookerLocationId)).then(
        (response) => {
          if (response.type === 'CANCEL_APPT_SUCCESS') {
            getAppts();
          }
        },
      );
    } else {
      dispatch(cancelAppointment(item.appointment.ID)).then((response) => {
        if (response.type === 'CANCEL_APPT_SUCCESS') {
          getAppts();
        }
      });
    }
    setDeleteItem(null);
  };

  const onBrowser = (action) => {
    if (action) {
      let link = action.linkToMobileSlug;
      if (link === 'styles') {
        return navigation.navigate('Account', {
          screen: 'AccountStyle',
        });
      } else if (link === 'services') {
        return navigation.navigate('Account', {
          screen: 'AccountService',
        });
      } else if (link === 'addons') {
        return navigation.navigate('Account', {
          screen: 'AccountAddon',
        });
      } else if (link === 'locator') {
        return navigation.navigate('Account', {
          screen: 'FindLocation',
        });
      } else if (link === 'barfly') {
        return navigation.navigate('Account', {
          screen: 'BarflyMembership',
        });
      }
    }
  };

  return (
    <View style={rootStyle.container}>
      <Authheader isCall />
      <Dialog.Container visible={!!deleteItem}>
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
          label="No"
          onPress={() => setDeleteItem(null)}
        />
        <Dialog.Button
          color="black"
          style={
            {
              // backgroundColor: Colors.dimGray,
            }
          }
          label="Yes"
          onPress={handleCancel}
        />
        {/* <Dialog.Button label="" onPress={handleDelete} /> */}
      </Dialog.Container>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={getAppts} />
        }>
        <View>
          <Text style={styles.hiText}>
            Hi {get(userInfo, 'firstname', 'Emily')}
          </Text>

          <UpcomingAppts
            data={upcomingAppt}
            navigation={navigation}
            locationData={data}
            onEdit={onEdit}
            onCancel={onCancel}
          />

          {pastAppt.length ? (
            <RebookAppts
              item={pastAppt[0]}
              onRebook={(item, location) => onEdit(item, location, true)}
              locationData={data}
            />
          ) : null}

          <Text
            onPress={() => navigation.navigate('My Appts')}
            style={styles.historyText}>
            View Appointment History
          </Text>

          {/* <View style={styles.memberBlock}>
            <Image source={Images.barfly} />
            <View style={{ flex: 1, paddingLeft: 20 }}>
              <Text style={styles.saveText}>Save 10% on your rebook with</Text>
              <Text
                onPress={() => navigation.navigate("BarflyMembership")}
                style={[styles.saveText, { textDecorationLine: "underline" }]}>
                Barfly Membership
              </Text>
            </View>
          </View> */}

          {/*<View style={styles.mapBlock}>
            <Image source={Images.snazzy} />
            <View style={styles.locationBlock}>
              <Text style={styles.locText}>
                Looking for the nearest {"\n"} Drybar Shop?
              </Text>

              <TouchableOpacity
                style={styles.locButton}
                onPress={() => navigation.navigate("Book")}>
                <Text style={styles.seeLocText}>See Locations</Text>
              </TouchableOpacity>
            </View>
          </View> */}
          {/* <View style={styles.dotContainer}>
            <DottedView number={200} />
            <Image
              style={{marginTop: 40, alignSelf: 'center'}}
              resizeMode="contain"
              source={Images.mix}
            />
            <Text style={styles.shopText}>Shop Mixologist</Text>
          </View> */}

          {homeData.map((item, index) => {
            if (item.marketingStyles) {
              let action = get(
                item,
                'marketingProducts.actionsCollection.items[0]',
              );
              return (
                <StyleSwiper
                  key={index}
                  title={item.marketingStyles.title}
                  imageSource={Images.lady}
                  data={item.marketingStyles.stylesCollection}
                  onBrowse={() => {
                    onBrowser(action);
                  }}
                  imgField={'featuredImage.desktopMedia.url'}
                  action={action}
                />
              );
            } else if (item.marketingProducts) {
              let action = get(
                item,
                'marketingProducts.actionsCollection.items[0]',
              );
              return (
                <StyleSwiper
                  key={index}
                  title={item.marketingProducts.title}
                  imageSource={Images.lady}
                  data={item.marketingProducts.productsCollection}
                  action={action}
                  onBrowse={() => {
                    onBrowser(action);
                  }}
                  imgField={'imagesCollection.items[0].mobileMedia.url'}
                />
              );
            } else if (item.marketingCard) {
              const imgUrl =
                get(item, 'marketingCard.image.mobileMedia.url') ||
                get(item, 'marketingCard.image.desktopMedia.url');
              let action = get(
                item,
                'marketingCard.actionsCollection.items[0]',
              );
              let img = null;
              if (imgUrl) {
                img = (
                  <Image
                    key={index}
                    source={{uri: imgUrl}}
                    resizeMode="contain"
                    style={styles.cardImage}
                  />
                );
              }

              if (img && action) {
                return (
                  <TouchableOpacity
                    onPress={() => onBrowser(action)}
                    key={index}>
                    {img}
                  </TouchableOpacity>
                );
              }
              if (img) {
                return img;
              }
            }
            return null;
          })}
          {/*
          <TouchableWithoutFeedback
            onPress={() =>
              navigation.navigate('Account', {
                screen: 'BarflyMembership',
                initial: false,
              })
            }>
            <Image
              resizeMode="contain"
              source={Images.barley_banner}
              style={{
                height: 150,
                width: '90%',
                alignSelf: 'center',
                marginTop: 20,
              }}
            />
          </TouchableWithoutFeedback>

          <Text style={styles.bottomTextStyle}>
            Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus
            accumsan et viverra justo commodo.
          </Text>

          <TouchableOpacity
            style={styles.bottomButtonContainer}
            onPress={() =>
              navigation.navigate('Account', {
                screen: 'BarflyMembership',
                initial: false,
              })
            }>
            <Text style={{fontSize: 18, fontFamily: Fonts.AvenirNextRegular}}>
              Learn More
            </Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>

      {isLoading ? <Indicator /> : null}
    </View>
  );
};

export default Home;
