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
import {editOrRebookFromAppointment, getLocations} from '../Booking/thunks';
import moment from 'moment';
import {storeCollectionQuery} from 'constant/query';
import {useQuery} from '@apollo/client';
import {getUser} from '@okta/okta-react-native';
import Dialog from 'react-native-dialog';

import styles from './styles';

const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.home.apptLoading);
  const upcomingAppt = useSelector((state) => state.home.appointments);
  const pastAppt = useSelector((state) => state.home.pastAppt);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [homeData, setHomeData] = useState([]);

  const LOCATION_QUERY = storeCollectionQuery();
  const {data, error, loading} = useQuery(LOCATION_QUERY);

  const [deleteItem, setDeleteItem] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

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
    const customerId = get(userInfo, 'bookerID');
    if (customerId) {
      getAppts();
      getCustomerDetails();
      getHomeData();
    } else {
      getUserInfo();
    }
  }, [userInfo]);

  const getUserInfo = async () => {
    const user = await getUser();
    dispatch(loginSuccess(user));
  };

  const getCustomerDetails = () =>
    dispatch(getCustomerInfo(get(userInfo, 'bookerID')));

  const getAppts = () =>
    dispatch(
      getAppointments(
        get(userInfo, 'bookerID'),
        5,
        moment().format('YYYY-MM-DD'),
      ),
    );

  const getHomeData = async () => {
    try {
      const d = await gqlLoadHome();
      setHomeData(d);
    } catch (error) {}
  };

  const onEdit = (item, location, past) => {
    MParticle.logEvent('Home - Rebook', MParticle.EventType.Navigation, {
      'Source Page': 'Home',
      'Book Type': 'Rebook',
    });

    dispatch(editOrRebookFromAppointment(location, item, past)).then((res) => {
      if (past) {
        navigation.navigate('Book', {screen: 'DateTime'});
      } else {
        navigation.navigate('Book', {screen: 'Services'});
      }
    });
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
    setDeleteItem({
      item,
      location,
      type,
    });
    setShowConfirm(true);
  };

  const handleCancel = () => {
    if (!deleteItem) {
      return;
    }
    const {item, location, type} = deleteItem;
    if (item.groupID) {
      dispatch(
        cancelItinerary(item.groupID, location.bookerLocationId, type),
      ).then((response) => {
        if (response.type === 'CANCEL_APPT_SUCCESS') {
          getAppts();
        }
      });
    } else {
      dispatch(cancelAppointment(item.appointment.ID, type)).then(
        (response) => {
          if (response.type === 'CANCEL_APPT_SUCCESS') {
            getAppts();
          }
        },
      );
    }
    setShowConfirm(false);
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
      } else if (link === 'events') {
        return navigation.navigate('Account', {
          screen: 'Events',
        });
      }
    }
  };

  return (
    <View style={rootStyle.container}>
      <Authheader isCall />
      <Dialog.Container visible={showConfirm}>
        <Dialog.Title>Cancel Appointment</Dialog.Title>
        <Dialog.Description>
          {get(deleteItem, 'type', 1) === 2
            ? "You're canceling within 2 hours of your appointment, so we need to charge our no show fee."
            : 'Are you sure you want to cancel?'}
        </Dialog.Description>

        <Dialog.Button
          color="black"
          label="No"
          onPress={() => setShowConfirm(false)}
        />
        <Dialog.Button color="black" label="Yes" onPress={handleCancel} />
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
            style={styles.historyText}
            accessible
            accessibilityLabel="Show My Appointments"
            accessibilityRole="link">
            View Appointment History
          </Text>

          {homeData.map((item, index) => {
            if (item.marketingStyles) {
              let action = get(
                item,
                'marketingStyles.actionsCollection.items[0]',
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
                    accessible
                    accessibilityLabel="Action"
                    accessibilityRole="link"
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
