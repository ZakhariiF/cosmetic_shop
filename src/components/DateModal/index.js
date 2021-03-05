import React, {useState, useEffect} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {Calendar} from 'react-native-calendars';
import {Colors, Fonts} from 'constant';
import moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Button from 'components/Button';
import {getDaysInMonth} from 'utils';
import {get} from 'lodash';

const {height} = Dimensions.get('window');

const DateModal = ({
  visible,
  onRequestClose,
  onDateSelection,
  changeMonth,
}) => {
  const [selectedDate, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedMonth, setSelectedMonth] = useState(
    moment(new Date()).format('MMMM'),
  );
  const [header, onChangeHeader] = useState();

  // useEffect(() => {
  //   changeMonth(header);
  // }, [header]);

  const renderHeader = (date) => {
    setSelectedMonth(moment(Object.values(date)[0]).format('MMMM'));

    onChangeHeader(Object.values(date)[0]);

    return (
      <Text style={styles.dateHeader}>
        {moment(Object.values(date)[0]).format('MMMM')}
      </Text>
    );
  };
  const renderArrowCalendar = (direction) => {
    return direction === 'left' ? (
      <MaterialIcons
        name="arrow-back-ios"
        size={22}
        color={Colors.header_title}
      />
    ) : (
      <MaterialIcons
        name="arrow-forward-ios"
        size={22}
        color={Colors.header_title}
      />
    );
  };

  const mark = {
    [selectedDate]: {
      selected: true,
      selectedColor: Colors.yellow,
    },
  };

  return (
    <Modal visible={visible} transparent onRequestClose={onRequestClose}>
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <View style={{width: '20%'}} />
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={styles.title} numberOfLines={1}>
                DATE SELECTION
              </Text>
            </View>
            <View style={{width: '20%', alignItems: 'center'}}>
              <Fontisto
                name="close-a"
                color={Colors.header_title}
                size={20}
                onPress={onRequestClose}
              />
            </View>
          </View>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'space-between',
            }}>
            <View>
              <Calendar
                theme={{
                  todayTextColor: 'black',
                  selectedDayTextColor: 'black',
                }}
                minDate={new Date()}
                renderHeader={renderHeader}
                renderArrow={renderArrowCalendar}
                markedDates={mark}
                onDayPress={(date) => {
                  setDate(date.dateString);
                }}
                disableArrowLeft={
                  moment(new Date()).format('MMMM') === selectedMonth
                }
                hideDayNames
              />
            </View>

            <Button
              name="Select The Date"
              onButtonPress={() => {
                onDateSelection(selectedDate);
                onRequestClose();
              }}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default DateModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.modal_bg,
  },
  mainContainer: {
    width: '85%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    height: height * 0.6,
    paddingHorizontal: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  title: {
    fontSize: 31,
    fontFamily: Fonts.DCondensed,
    color: Colors.header_title,
  },
  dateHeader: {
    fontSize: 26,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextMedium,
  },
});
