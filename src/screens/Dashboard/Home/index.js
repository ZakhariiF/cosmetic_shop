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
import {greetings} from 'utils';
import {gqlLoadHome} from 'constant/contentfulHomeActions';
import {getLocations, setIsEdit, setmemberCount} from '../Booking/thunks';
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
  const [homeData, setHomeData] = useState({});
  const [backpermission, setbackpermission] = useState(false);
  const LOCATION_QUERY = storeCollectionQuery();
  const {data, error, loading} = useQuery(LOCATION_QUERY);

  console.log('HOME SCREEN userinfo', userInfo);

  React.useMemo(() => {
    if (loading || error) return null;

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
    Radar.setUserId("00uca8ebhdc27qHNh1d6");
    Radar.getPermissionsStatus().then(status => {
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
   })
  }
  requestRadarPermission = () => {
    let permisson = Radar.requestPermissions(true);
    console.log("Request Permission Result", permisson);
  }

  const onRebook = (item) => {
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

          <UpcomingAppts data={upcomingAppt} navigation={navigation} />

          {pastAppt.length ? (
            <RebookAppts item={pastAppt[0]} onRebook={onRebook} />
          ) : null}

          <Text
            onPress={() => navigation.navigate('My Appts')}
            style={styles.historyText}>
            View Appointment History
          </Text>
          <View style={styles.memberBlock}>
            <Image source={Images.barfly} />
            <View style={{flex: 1, paddingLeft: 20}}>
              <Text style={styles.saveText}>Save 10% on your rebook with</Text>
              <Text
                onPress={() => navigation.navigate('BarflyMembership')}
                style={[styles.saveText, {textDecorationLine: 'underline'}]}>
                Barfly Membership
              </Text>
            </View>
          </View>

          <View style={styles.mapBlock}>
            <Image source={Images.snazzy} />
            <View style={styles.locationBlock}>
              <Text style={styles.locText}>
                Looking for the nearest {'\n'} Drybar Shop?
              </Text>

              <TouchableOpacity
                style={styles.locButton}
                onPress={() => navigation.navigate('Book')}>
                <Text style={styles.seeLocText}>See Locations</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.dotContainer}>
            {/* <DottedView number={200} /> */}
            <Image
              style={{marginTop: 40, alignSelf: 'center'}}
              resizeMode="contain"
              source={Images.mix}
            />
            <Text style={styles.shopText}>Shop Mixologist</Text>
          </View>

          {get(homeData, 'theStyles') && (
            <StyleSwiper
              title="The Styles"
              imageSource={Images.lady}
              data={get(homeData, 'theStyles', {})}
              onBrowse={() =>
                navigation.navigate('Account', {screen: 'AccountStyle'})
              }
            />
          )}

          {/* <StyleSwiper
            title="AddOns"
            imageSource={Images.addons}
            onBrowse={() =>
              navigation.navigate('Account', {
                screen: 'AccountAddon',
                initial: false,
              })
            }
          /> */}

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
          </TouchableOpacity>
        </View>
      </ScrollView>

      {isLoading ? <Indicator /> : null}
    </View>
  );
};

export default Home;
