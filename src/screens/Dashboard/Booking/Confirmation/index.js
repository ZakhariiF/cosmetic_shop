import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import Button from 'components/Button';
import ConfirmationList from 'components/ConfimationList';
import DottedView from 'components/DottedView';
import AuthHeader from 'components/Header/Authheader';
import Header from 'components/Header/Header';
import {Colors, Fonts, Images} from 'constant';
import rootStyle from 'rootStyle';
import {useSelector} from 'react-redux';
import {reset} from 'navigation/RootNavigation';
import {get} from 'lodash';
import {openMaps} from 'utils';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import moment from 'moment';
import {bannerQuery} from 'constant/query';
import {useQuery} from '@apollo/client';



const Confirmation = () => {
  const banner_Query = bannerQuery();
  console.log(useQuery(banner_Query));
  const {data} = useQuery(banner_Query);
  const bannerImageUrl = get(data, 'screenCollection.items[0].marketingComponentsCollection.items[0].mobileMedia.url');
  console.log(bannerImageUrl);
  const totalGuests = useSelector((state) => state.booking.totalGuests);
  const selectedLocation = useSelector(
    (state) => state.booking.selectedLocation,
  );
  const openCalendarApp = () => {
    const startDateTimeString = totalGuests[0].date.time.startDateTime;
    const startDateTime = new Date(startDateTimeString);
    const endDateTimeString = totalGuests[0].date.time.endDateTime;
    const endDateTime = new Date(endDateTimeString);
    const eventConfig = {
      title: 'Drybar booking',
      startDate: moment.utc(startDateTime).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      endDate: moment.utc(endDateTime).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    };
    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then((eventInfo) => {
        console.warn(JSON.stringify(eventInfo));
      })
      .catch((error) => {
        // handle error such as when user rejected permissions
        console.warn(error);
      });
  }
  return (
    <View style={rootStyle.container}>
      <AuthHeader />
      <View style={rootStyle.sizeBox} />
      <Header isBack={false} title="YOU’RE ALL SET!" />

      <View style={rootStyle.innerContainer}>
        <FlatList
          data={totalGuests}
          keyExtractor={(_, index) => index.toString()}
          renderItem={(e) => <ConfirmationList {...e} data={totalGuests} />}
          ListHeaderComponent={() => (
            <>
              <Text style={styles.heading}>
                Please don’t blow us off! If you can’t make your appointment, please be sure to cancel so we can try to fill your spot. Thank you!
              </Text>
              <TouchableOpacity
                onPress={() =>
                  openMaps(
                    get(selectedLocation, 'title', ''),
                    get(selectedLocation, 'contact.coordinates[0]'),
                    get(selectedLocation, 'contact.coordinates[1]'),
                  )
                }>
                <View style={styles.locContainer}>
                  <Text style={styles.loc}>
                    {get(selectedLocation, 'title', '')}
                  </Text>
                  <TouchableOpacity>
                    <Image source={Images.loc} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </>
          )}
          ListFooterComponent={() => (
            <>
              <View style={styles.saveButtonContainer}>
                <TouchableOpacity onPress={openCalendarApp}>
                  <Text style={styles.saveButton}>Save to Calendar</Text>
                </TouchableOpacity>
              </View>
              <Button
                name="Manage Appointments"
                onButtonPress={() => reset('Dashboard')}
              />

              <View style={styles.specialContainer}>
                <DottedView containerStyle={{flex: 1}} />
                <Image
                  resizeMode="contain"
                  source={Images.offer}
                  style={{marginLeft: 10, marginRight: 10}}
                />
                <DottedView containerStyle={{flex: 1}} />
              </View>
              
              <Image
                resizeMode="contain"
                source={{uri: bannerImageUrl}}
                style={styles.chaserIcon}
              />

              <Button
                name="Buy Chaser"
                containerStyle={styles.chaserContainer}
                titleStyle={styles.chaserTitle}
              />
            </>
          )}
        />
      </View>
    </View>
  );
};

export default Confirmation;

const styles = StyleSheet.create({
  heading: {
    ...rootStyle.commonText,
    textAlign: 'center',
    alignSelf: 'center',
  },
  locContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  loc: {
    ...rootStyle.commonText,
    fontFamily: Fonts.AvenirNextMedium,
    marginRight: 12,
  },
  specialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    alignSelf: 'center',
    marginVertical: 20,
  },
  chaserContainer: {
    marginVertical: 30,
    backgroundColor: Colors.white,
  },
  chaserTitle: {
    color: Colors.header_title,
  },
  chaserIcon: {
    width: '94%',
    alignSelf: 'center',
    aspectRatio: 1
  },
  saveButtonContainer: {
    width:'100%',
    alignItems:'center'
  },
  saveButton: {
    ...rootStyle.commonText,
    textDecorationLine: 'underline'
  }
});
