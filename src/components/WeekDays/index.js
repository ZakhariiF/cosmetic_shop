import {Colors, Fonts} from 'constant';
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
} from 'react-native';
import rootStyle from 'rootStyle';
import moment from 'moment';

const WeekDays = ({currentWeek, selectDate, onDateChange}) => {
  return (
    <View>
      <ScrollView horizontal style={{marginTop: 10}}>
        {currentWeek.map((e, i) => {
          return (
            <View key={i} style={{marginHorizontal: 5}}>
              <Text style={styles.weekDay}>{e.day}</Text>
              <TouchableOpacity
                disabled={e.disable}
                accessible
                accessibilityLabel={`Select ${e.date}`}
                accessibilityRole="button"
                onPress={() => onDateChange(e.fulldate)}
                style={[
                  styles.weekContainer,
                  e.disable && {backgroundColor: Colors.dashed},
                  moment(selectDate).format('DD') == e.date && {
                    backgroundColor: Colors.header_title,
                  },
                ]}>
                <Text
                  style={[
                    styles.weekDate,
                    moment(selectDate).format('DD') == e.date && {
                      color: Colors.white,
                    },
                  ]}>
                  {e.date}
                </Text>
                {/* <Text
                  style={[
                    styles.weekBottom,
                    moment(selectDate).format('DD') == e.date && {
                      color: Colors.white,
                    },
                  ]}>
                  (14)
                </Text> */}
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default WeekDays;

const styles = StyleSheet.create({
  weekContainer: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.seprator,
    backgroundColor: Colors.white,
  },
  weekDay: {
    fontSize: 13,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.header_title,
    alignSelf: 'center',
    marginBottom: 5,
  },
  weekDate: {
    ...rootStyle.commonText,
    fontFamily: Fonts.AvenirNextMedium,
  },
  weekBottom: {
    ...rootStyle.commonText,
    fontSize: 11,
  },
});
