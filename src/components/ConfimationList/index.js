import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {Colors, Fonts, Images} from 'constant';
import rootStyle from 'rootStyle';
import {get} from 'lodash';
import moment from 'moment';

const ConfirmationList = ({item, index, data}) => {
  const timezone = get(item, 'date.time.timezone', 0)
  const startTime = moment(get(item, 'date.time.startDateTime', '')).utcOffset(timezone)
  return (
    <View style={styles.container}>
      {data.length > 1 ? (
        <View style={{flexDirection: 'row'}}>
          <View style={styles.numberCircle}>
            <Text style={styles.number}>{index + 1}</Text>
          </View>
          <Text style={styles.userType}>{get(item, 'userType', '')}</Text>
        </View>
      ) : null}

      <View style={styles.clock}>
        <View style={styles.box}>
          <Image source={Images.clock} />
          <View>
            <Text style={styles.infoText}>
              {startTime.format('h:mm a')}
            </Text>
            <Text style={styles.bottomText}></Text>
          </View>
        </View>
        <View style={styles.box}>
          <Image
            source={Images.calendar}
            resizeMode="contain"
            style={styles.icon}
          />
          <View>
            <Text style={styles.infoText}>
              {startTime.format('MM / DD')}
            </Text>
            <Text style={styles.bottomText}>
              In {startTime.diff(moment(new Date()), 'days')} days
            </Text>
          </View>
        </View>

        <View style={styles.box}>
          <Image
            source={Images.dryer}
            resizeMode="contain"
            style={styles.dryicon}
          />
          <View>
            <Text style={styles.infoText} numberOfLines={2}>
              {get(item, 'services.Name', '')}
            </Text>
            <Text style={styles.bottomText}>
              {get(item, 'addons', []).length} add ons
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ConfirmationList;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  numberCircle: {
    height: 18,
    width: 18,
    borderWidth: 0.8,
    borderRadius: 18 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 11,
  },
  userType: {
    flex: 1,
    textAlign: 'center',
    ...rootStyle.commonText,
    fontFamily: Fonts.AvenirNextMedium,
  },
  box: {
    height: 100,
    width: '28%',
    backgroundColor: Colors.white,
    borderRadius: 4,
    borderColor: Colors.seprator,
    borderWidth: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  icon: {
    tintColor: Colors.yellow,
    width: 18,
    height: 18,
  },
  infoText: {
    fontSize: 13,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextBold,
    textAlign: 'center',
  },
  bottomText: {
    fontSize: 11,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextItalic,
    textAlign: 'center',
  },
  clock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  dryicon: {
    height: 40,
    width: 22,
    marginTop: -13,
  },
});
