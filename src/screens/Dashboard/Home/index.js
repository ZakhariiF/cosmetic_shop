import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  RefreshControl,
  TouchableWithoutFeedback,
} from 'react-native';
import rootStyle from 'rootStyle';
import Authheader from 'components/Header/Authheader';
import styles from './styles';
import UpcomingAppts from 'components/UpcomingAppts';
import {Fonts, Images} from 'constant';
import StyleSwiper from 'components/StyleSwiper';
import RebookAppts from 'components/RebookAppts';
import {getAppointments} from '../thunks';
import {useDispatch, useSelector} from 'react-redux';
import Indicator from 'components/Indicator';
import {get} from 'lodash';
import {getCustomerInfo} from 'screens/Auth/thunks';
import { greetings, mapGraphqlToNavigator } from "utils";
import {gqlLoadHome} from 'constant/contentfulHomeActions';
import {
  getLocations,
  setIsEdit,
  setLocation,
  setmemberCount,
} from '../Booking/thunks';
import moment from 'moment';
import {storeCollectionQuery} from 'constant/query';
import {useQuery} from '@apollo/client';
import Radar from 'react-native-radar';

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

  console.log('HOME SCREEN userinfo', userInfo);

  React.useMemo(() => {
    if (loading || error) {
      return null;
    }

    dispatch(getLocations(data.storeCollection.items));
    return data;
  }, [loading, error, data]);

  useEffect(() => {
    getAppts();
    getCustomerDetails();
    getHomeData();
    hasRadarPermission();
  }, []);

  const getCustomerDetails = () =>
    dispatch(getCustomerInfo(get(userInfo, 'profile.bookerId', '')));

  const getAppts = () =>
    dispatch(getAppointments(get(userInfo, 'profile.bookerId', '')));

  const getHomeData = async () => {
    try {
      const d = await gqlLoadHome();
      setHomeData(d);
    } catch (error) {}
  };
  const hasRadarPermission = () => {
    Radar.setUserId('00uca8ebhdc27qHNh1d6');
    Radar.getPermissionsStatus().then((status) => {
      switch (status) {
        case 'GRANTED_BACKGROUND':
          console.log('GRANTED_BACKGROUND Permission granted');
          setbackpermission(true);
          break;
        case 'GRANTED_FOREGROUND':
          console.log('GRANTED_FOREGROUND Permission granted');
          requestRadarPermission();
          break;
        case 'DENIED':
          console.log('Radar Denied');
          requestRadarPermission();
          break;
        case 'UNKNOWN':
          console.log('UNKWOWN');
          requestRadarPermission();
          break;
        default:
          break;
      }
    });
  };
  const requestRadarPermission = () => {
    let permisson = Radar.requestPermissions(true);
    console.log('Request Permission Result', permisson);
  };

  const onRebook = (item, location) => {
    let tempArr = get(item, 'appointment.AppointmentTreatments', []).map(
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
    dispatch(setIsEdit(true));

    navigation.navigate('Book', {screen: 'Review', initial: false});
  };

  return (
    <View style={rootStyle.container}>
      <Authheader isCall />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={getAppts} />
        }>
        <View>
          <Text style={styles.hiText}>
            Hi {get(userInfo, 'profile.firstName', 'Emily')}, {greetings()}
          </Text>

          <UpcomingAppts
            data={upcomingAppt}
            navigation={navigation}
            locationData={data}
          />

          {pastAppt.length ? (
            <RebookAppts
              item={pastAppt[0]}
              onRebook={onRebook}
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

          {homeData.map((item) => {
            if (item.marketingStyles) {
              return (
                <StyleSwiper
                  title={item.marketingStyles.title}
                  imageSource={Images.lady}
                  data={item.marketingStyles.stylesCollection}
                  onBrowse={() =>
                    navigation.navigate('Account', {screen: 'AccountStyle'})
                  }
                  imgField={'featuredImage.desktopMedia.url'}
                />
              );
            } else if (item.marketingProducts) {
              return (
                <StyleSwiper
                  title={item.marketingProducts.title}
                  imageSource={Images.lady}
                  data={item.marketingProducts.productsCollection}
                  onBrowse={() =>
                    navigation.navigate('Account', {screen: 'AccountStyle'})
                  }
                  imgField={'imagesCollection.items[0].mobileMedia.url'}
                />
              );
            } else if (item.marketingCard) {
              const imgUrl =
                get(item, 'marketingCard.image.mobileMedia.url') ||
                get(item, 'marketingCard.image.desktopMedia.url');
              let action = get(
                item,
                'marketingCard.actionsCollection.items[0].linkToMobileSlug',
              );
              if (action) {
                action = mapGraphqlToNavigator[action];
              }
              let img = null;
              if (imgUrl) {
                img = (
                  <Image
                    source={{uri: imgUrl}}
                    resizeMode="contain"
                    style={styles.cardImage}
                  />
                );
              }
              if (img && action) {
                return (
                  <TouchableOpacity onPress={() => navigation.navigate(action)}>
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
