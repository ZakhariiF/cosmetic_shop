import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import rootStyle from 'rootStyle';
import Header from 'components/Header/Header';
import {Colors, Fonts, Images} from 'constant';
import moment from 'moment';
import {monthName} from 'utils';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAvailableDates,
  getEmplyeesData,
  getMultiUserTimeSlots,
  getServices,
  setmemberCount,
} from '../thunks';
import BookingTab from 'components/BookingTab';
import LocationModal from 'components/LocationModal';
import {get} from 'lodash';
import EmptyContainer from 'components/EmptyContainer';
import Indicator from 'components/Indicator';
import DateModal from 'components/DateModal';
import WeekDays from 'components/WeekDays';
import {types} from '../ducks';
import {AlertHelper} from 'utils/AlertHelper';
import MParticle from 'react-native-mparticle';

const DateTime = ({navigation}) => {
  const dispatch = useDispatch();
  const totalGuests = useSelector((state) => state.booking.totalGuests);
  const activeTab = useSelector((state) => state.booking.activeGuestTab);
  const weekAvailableDates = useSelector(
    (state) => state.booking.availableDates,
  );

  const fromDate = get(totalGuests, `[${activeTab}].date.date`);

  const isLoading = useSelector((state) => state.booking.slotsLoading);
  const multiuserSlots = useSelector((state) => state.booking.multiUserSlots);

  const extensionAddon = useSelector((state) => state.booking.extensionAddon);
  const selectedLocation = useSelector(
    (state) => state.booking.selectedLocation,
  );
  const isEmpLoading = useSelector((state) => state.booking.isEmpLoading);
  const [selectedDate, setSelectedDate] = useState(
    fromDate ? new Date(fromDate) : null,
  );
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [currentWeek, setcurrentWeek] = useState([]);
  const services = useSelector((state) => state.booking.services);

  useEffect(() => {
    if (!selectedDate && weekAvailableDates && weekAvailableDates.length) {
      const timezone = moment().utcOffset(weekAvailableDates[0]).utcOffset();

      setSelectedDate(
        new Date(
          moment(weekAvailableDates[0])
            .utcOffset(timezone)
            .format('YYYY-MM-DDT00:00:00'),
        ),
      );
    }
    // else if (!selectedDate && weekAvailableDates && weekAvailableDates.length === 0) {
    //   setSelectedDate(new Date());
    // }
  }, [selectedDate, weekAvailableDates]);

  useEffect(() => {
    if (
      !services.length &&
      selectedLocation &&
      selectedLocation.bookerLocationId
    ) {
      dispatch(getServices(selectedLocation.bookerLocationId));
    }
  }, [selectedLocation]);

  useEffect(() => {
    availableDates(new Date());
  }, []);

  useEffect(() => {
    if (selectedDate) {
      var currentDate = moment(selectedDate);
      var weekStart = currentDate.clone().startOf('isoweek');
      var days = [];

      for (var i = 0; i <= 6; i++) {
        days.push({
          day: moment(weekStart).add(i, 'days').format('ddd'),
          date: moment(weekStart).add(i, 'days').format('DD'),
          fulldate: moment(weekStart).add(i, 'days').format(),
          disable:
            moment().format('YYYY-MM-DD') >
            moment(weekStart).add(i, 'days').format('YYYY-MM-DD'),
        });
      }
      setcurrentWeek(days);
    }
  }, [selectedDate]);

  const availableDates = (date) => {
    const now = moment(date);
    const weekfirstDay = now.clone().weekday(1);
    const weekLastDay = now.clone().weekday(7);
    let multiUserobj = {
      locationIds: get(selectedLocation, 'bookerLocationId', ''),
      fromDate: weekfirstDay.format('YYYY-MM-DDT00:00:00'),
      toDate: moment(weekLastDay).format('YYYY-MM-DDT00:00:00'),
    };

    dispatch(getAvailableDates(multiUserobj));
  };

  useEffect(() => {
    if (!selectedDate) {
      return;
    }
    // availableDates(selectedDate);

    const locationId = get(selectedLocation, 'bookerLocationId', '');

    if (locationId && locationId !== '') {
      let multiUserobj = {
        locationId: locationId,
        fromDateTime: moment(selectedDate).format('YYYY-MM-DDTHH:mm:ssZ'),
        IncludeEmployees: true,
        IncludeFreelancers: false,
      };

      multiUserobj.itineraries = totalGuests.map((element) => {
        return {
          serviceId: element.services.ID,
        };
      });

      dispatch(getMultiUserTimeSlots(multiUserobj));
    } else {
      navigation.navigate('Book', {screen: 'Location'});
    }
  }, [selectedDate]);

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const isExist = (item) => {
    let isActive = false;
    if (
      totalGuests[activeTab].date &&
      totalGuests[activeTab].date.time === item
    ) {
      isActive = true;
    }

    return isActive;
  };

  const onSlot = (dateItem) => {
    MParticle.logEvent('Select Time', MParticle.EventType.Other, {
      'Source Page': 'Date Time Selection',
      Date: moment(selectedDate)
        .utcOffset(dateItem.timezone)
        .format('YYYY-MM-DD'),
      Time: moment(dateItem.startDateTime)
        .utcOffset(dateItem.timezone)
        .format('HH:mm:ss'),
    });
    let tempArr = [...totalGuests];
    tempArr = tempArr.map((user) => ({
      ...user,
      date: {time: dateItem, date: selectedDate},
    }));
    const locationId = get(selectedLocation, 'bookerLocationId', '');

    const usedEmployees = [];
    const extensionObjs = [];
    const objs = tempArr.map((item, idx) => {
      const employeeIds = item.date.time.availabilityItems
        .filter(
          (avItem) =>
            avItem.serviceId === item.services.ID &&
            !usedEmployees.includes(avItem.employeeId),
        )
        .map((em) => em.employeeId);
      const employeeId = employeeIds.length > 0 ? employeeIds[0] : null;
      tempArr[idx].employees = employeeId;

      if (employeeId) {
        usedEmployees.push(employeeId);

        if (tempArr[idx].addons && tempArr[idx].addons.length) {
          tempArr[idx].addons = tempArr[idx].addons.map((i) => ({
            ...i,
            employees: employeeId,
          }));
        }
      }

      // const addons = item.addons || [];
      const addons = [];

      if (item.extension && item.extension.name === 'Yes' && extensionAddon) {
        addons.push(extensionAddon);
      }

      let endTime = moment(dateItem.startDateTime)
        .add(item.services.TotalDuration, 'minutes')
        .utcOffset(dateItem.timezone);

      addons.forEach((a) => {
        extensionObjs.push({
          locationId,
          serviceId: a.ID,
          startDateTime: moment(endTime).format('YYYY-MM-DDTHH:mm:ssZ'),
        });

        endTime += moment(endTime)
          .add(a.TotalDuration, 'minutes')
          .utcOffset(dateItem.timezone);
      });

      return {
        locationId,
        serviceId: item.services.ID,
        startDateTime: dateItem.startDateTime,
        employeeId,
      };
    });

    dispatch(getEmplyeesData(objs, extensionObjs)).then((response) => {
      if (response.type === types.GET_EMPLOYEE_SUCCESS) {
        const usedRoomIds = [];
        get(response, 'payload').forEach((item, idx) => {
          let rooms = get(item, 'rooms', []).filter(
            (e) => e.available === 'Yes' && !usedRoomIds.includes(e.roomId),
          );
          if (rooms.length) {
            tempArr[idx].rooms = rooms[0].roomId;
            usedRoomIds.push(rooms[0].roomId);

            if (tempArr[idx].addons && tempArr[idx].addons.length) {
              tempArr[idx].addons = tempArr[idx].addons.map((i) => ({
                ...i,
                rooms: rooms[0].roomId,
              }));
            }
          }
        });

        const extensionIdxs = tempArr
          .map((item, idx) => {
            if (item.extension) {
              return idx;
            }
            return -1;
          })
          .filter((idx) => idx >= 0);

        if (extensionIdxs.length) {
          get(response, 'extensionData', []).map((item, idx) => {
            if (extensionIdxs[idx] !== undefined) {
              const currentItem = tempArr[extensionIdxs[idx]];
              let extensionEmployee = item.employees.find(
                (e) =>
                  e.available === 'Yes' &&
                  e.employeeId === currentItem.employees,
              );
              if (!extensionEmployee) {
                extensionEmployee = item.employees.find(
                  (e) =>
                    e.available === 'Yes' &&
                    usedEmployees.includes(e.employeeId),
                );
              }
              if (extensionEmployee) {
                extensionEmployee = extensionEmployee.employeeId;
                usedEmployees.push(extensionEmployee);
              }

              let extensionroom = item.rooms.find(
                (e) => e.available === 'Yes' && e.roomId === currentItem.rooms,
              );
              if (!extensionroom) {
                extensionroom = item.rooms.find(
                  (e) => e.available === 'Yes' && usedRoomIds.includes(e.rooms),
                );
              }

              if (extensionroom) {
                extensionroom = extensionroom.roomId;
                usedRoomIds.push(extensionroom);
              }

              tempArr[extensionIdxs[idx]].extension = {
                ...tempArr[extensionIdxs[idx]].extension,
                employee: extensionEmployee,
                rooms: extensionroom,
                serviceId: extensionAddon.ID,
              };
            }
          });
        }
        if (tempArr.find((o) => !o.rooms || !o.employees)) {
          AlertHelper.showError('Please choose another time slot');
          return;
        }
        dispatch(setmemberCount(tempArr));
        onNext(tempArr);
      }
    });
  };

  const renderTime = ({item}) => {
    let active = isExist(item);

    return (
      <TouchableOpacity
        style={[styles.timeListContainer, active && rootStyle.activeButton]}
        onPress={() => onSlot(item)}
        accessible
        accessibilityLabel={moment(item.startDateTime).utcOffset(item.timezone).format('h:mm a')}
        accessibilityRole="button">
        <Text style={[styles.time, active && rootStyle.activeButtonText]}>
          {/* {moment(item.open).format('h:mm a')} */}
          {moment(item.startDateTime).utcOffset(item.timezone).format('h:mm a')}
        </Text>
        {/* <Text style={styles.slot}>1 slot available</Text> */}
      </TouchableOpacity>
    );
  };

  const onNext = (tempArr) => {
    let isDate = tempArr.every((e) => e.date);
    if (isDate) {
      navigation.navigate('Notes');
    }
  };

  useEffect(() => {
    MParticle.logEvent('Select Date', MParticle.EventType.Other, {
      'Source Page': 'Date Time Selection',
      Date: moment(selectedDate).format('YYYY-MM-DD'),
    });
  }, [selectedDate]);

  return (
    <View style={rootStyle.container}>
      <BookingTab />
      <View style={rootStyle.sizeBox} />
      <Header
        title="DATE & TIME"
        safeBackColor={Colors.bg}
        onBackPress={() => navigation.navigate('Addons')}
      />

      <View style={rootStyle.innerContainer}>
        <Text style={styles.heading}>
          Plan for <Text style={styles.minText}>50 mins</Text> for your service
        </Text>

        <View style={styles.seprator} />

        <View style={styles.calendarContainer}>
          <Text style={styles.month}>{monthName(selectedDate)}</Text>

          <TouchableOpacity
            style={{flexDirection: 'row'}}
            accessible
            accessibilityLabel="Show Calendar"
            accessibilityRole="button"
            onPress={() => setDatePickerVisibility(true)}>
            <Text style={styles.calendarText}>Show Calendar</Text>
            <Image source={Images.calendar} />
          </TouchableOpacity>
        </View>

        {currentWeek.length ? (
          <WeekDays
            currentWeek={currentWeek}
            onDateChange={(date) => {
              const today = new Date();
              let updatedDate = new Date(date);

              if (today.getTime() > updatedDate.getTime()) {
                updatedDate = today;
              }
              setSelectedDate(updatedDate);
            }}
            // onDateChange={() => navigation.navigate('Notes')}
            selectDate={selectedDate}
          />
        ) : null}

        {selectedDate ? (
          <>
            <Text style={styles.selectDate}>
              {moment(selectedDate).format('MMMM DD, YYYY')}
            </Text>

            {/* {totalGuests.length > 1 ? (
              <View style={{marginTop: 10}}>
                <GuestTab routeName="dates" />
              </View>
            ) : null} */}

            <FlatList
              style={{marginTop: 10, marginBottom: '20%'}}
              data={multiuserSlots}
              renderItem={renderTime}
              keyExtractor={(_, index) => index.toString()}
              ListEmptyComponent={() => (
                <EmptyContainer emptyText="No Slots Found" />
              )}
            />
          </>
        ) : null}
      </View>

      <DateModal
        visible={isDatePickerVisible}
        onRequestClose={hideDatePicker}
        onDateSelection={(date) => {
          // let d = moment(new Date());
          setSelectedDate(moment(date).toDate());
        }}
        // changeMonth={(date) => availableDates(date)}
      />

      <LocationModal />

      {isLoading || isEmpLoading ? <Indicator /> : null}
    </View>
  );
};

export default DateTime;

const styles = StyleSheet.create({
  heading: {
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
    alignSelf: 'center',
  },
  minText: {
    fontFamily: Fonts.AvenirNextBold,
  },
  seprator: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.seprator,
    marginTop: 30,
  },
  calendarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  month: {
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextMedium,
  },
  calendarText: {
    fontSize: 13,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
    textDecorationLine: 'underline',
    marginRight: 10,
  },
  selectDate: {
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextBold,
    marginTop: 20,
  },
  timeListContainer: {
    height: 64,
    width: '100%',
    backgroundColor: Colors.white,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ...rootStyle.shadow,
  },
  time: {
    fontSize: 18,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.header_title,
  },
  slot: {
    fontSize: 15,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.header_title,
  },
});
