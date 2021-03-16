import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import Header from 'components/Header/Header';
import PromoInput from 'components/PromoInput';
import {Colors, Fonts, Images} from 'constant';
import rootStyle from 'rootStyle';
import Entypo from 'react-native-vector-icons/Entypo';
import CheckBox from 'components/Checkbox';
import Button from 'components/Button';
import {useDispatch, useSelector} from 'react-redux';
import {get} from 'lodash';
import moment from 'moment';
import BookingTab from 'components/BookingTab';
import {
  applyPromoCode,
  createAppointment,
  createGuestAppointment,
  setExtensionType,
} from '../thunks';
import Indicator from 'components/Indicator';
import {getAppointments, cancelAppointment, cancelItinerary} from 'screens/Dashboard/thunks';
// import {cancelItinerary, cancelAppt} from 'services';
import MParticle from 'react-native-mparticle';
import BookingHeader from "components/BookingHeader";

const Review = ({navigation, route}) => {
  const [isChecked, setChecked] = useState(false);
  const dispatch = useDispatch();
  const totalGuests = useSelector((state) => state.booking.totalGuests);
  const isLoading = useSelector((state) => state.booking.bookingLoading);
  const isPromo = useSelector((state) => state.booking.isPromoLoad);
  const fromEdit = useSelector((state) => state.booking.fromEdit);
  const promoInfo = useSelector((state) => state.booking.promoData);
  const extensionAddon = useSelector((state) => state.booking.extensionAddon);
  const selectedLocation = useSelector(
    (state) => state.booking.selectedLocation,
  );
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [estimateTotal, setTotal] = useState(0);
  const [isAddon, setisAddOn] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    calculateTotal();
    checkAddonData();
    if (totalGuests.length > 1) {
      guestList();
    }
  }, []);

  const checkAddonData = () => {
    let isAddon = totalGuests.some((e) => e.addons && e.addons.length);
    setisAddOn(isAddon);
  };

  const calculateTotal = () => {
    const totalPrice = totalGuests.reduce((acc, e) => {
      let addonPrice = 0;
      if (get(e, 'addons')) {
        addonPrice = e.addons.reduce(
          (val, item) => get(item, 'PriceInfo.Amount', 0) + val,
          0,
        );
      }

      if (e.extension && e.extension.name === 'Yes' && extensionAddon) {
        addonPrice += get(extensionAddon, 'Price.Amount', 0);
      }

      return acc + get(e.services, 'Price.Amount', 0) + addonPrice;
    }, 0);

    setTotal(totalPrice);
  };

  const bookAppt = () => {
    const startTime = get(totalGuests, '[0].date.time.startDateTime', '');
    const timezone = get(totalGuests, '[0].date.time.timezone', '');
    let endTime = moment(startTime)
      .add(get(totalGuests, '[0].services.TotalDuration', 45), 'minutes')
      .utcOffset(timezone)
      .format('YYYY-MM-DDTHH:mm:ssZ');

    const addons = get(totalGuests, '[0].addons', []);

    let extraNotes = route.params.Notes || '';

    addons.forEach((a) => {
      if (a.Duration !== 5) {
        endTime = moment(endTime)
          .add(a.Duration, 'minutes')
          .utcOffset(timezone)
          .format('YYYY-MM-DDTHH:mm:ssZ');
      }
      extraNotes = `${extraNotes} AddOn: ${a.ServiceName}.`;
    });

    const items = [
      {
        EmployeeID: get(totalGuests, '[0].employees', ''),
        StartTimeOffset: startTime,
        EndTimeOffset: endTime,
        TreatmentID: get(totalGuests, '[0].services.ID'),
        RoomID: get(totalGuests, '[0].rooms'),
      },
    ];

    // if (addons && addons.length) {
    //   addons.forEach((e) => {
    //     let endAddonTime = moment(endTime)
    //       .add(e.TotalDuration || 10, 'minutes')
    //       .utcOffset(timezone)
    //       .format('YYYY-MM-DDTHH:mm:ssZ');
    //
    //     items.push({
    //       EmployeeID: e.employees,
    //       StartTimeOffset: endTime,
    //       EndTimeOffset: endAddonTime,
    //       TreatmentID: e.ID,
    //       RoomID: e.rooms,
    //     });
    //
    //     endTime = endAddonTime;
    //   });
    // }

    if (
      totalGuests[0].extension &&
      totalGuests[0].extension.name === 'Yes' &&
      extensionAddon
    ) {
      items.push({
        EmployeeID: get(totalGuests[0].extension, 'employee', ''),
        StartTimeOffset: endTime,
        EndTimeOffset: moment(endTime)
          .add(extensionAddon.TotalDuration, 'minutes')
          .utcOffset(timezone)
          .format('YYYY-MM-DDTHH:mm:ssZ'),
        TreatmentID: extensionAddon.ID,
        RoomID: get(totalGuests[0].extension, 'rooms'),
      });
    }

    let obj = {
      AppointmentDateOffset: get(
        totalGuests,
        '[0].date.time.startDateTime',
        '',
      ),
      AppointmentTreatmentDTOs: items,
      Customer: {
        FirstName: get(userInfo, 'firstname', ''),
        LastName: get(userInfo, 'lastname', ''),
        Email: get(userInfo, 'preferred_username', ''),
        HomePhone: get(userInfo, 'primaryPhone', ''),
        ID: get(userInfo, 'bookerID', ''),
        SendEmail: true,
      },
      AppointmentPayment: {
        CouponCode: get(promoInfo, 'CouponCode', ''),
      },
      ResourceTypeID: 1,
      LocationID: get(selectedLocation, 'bookerLocationId', ''),
      // LocationID:'1639',
      Notes: extraNotes,
    };

    dispatch(
      createAppointment(
        obj,
        addons,
        get(selectedLocation, 'bookerLocationId', ''),
      ),
    ).then((res) => {
      if (res.payload && res.payload.IsSuccess) {
        dispatch(getAppointments(get(userInfo, 'bookerID', '')));
        navigation.navigate('Confirmation', {
          apptInfo: res.payload.Appointment,
        });
      }
    });
  };

  const guestList = () => {
    const guestData = [];
    for (let i = 0; i < totalGuests.length; i++) {
      const startTime = totalGuests[i]?.date.time.startDateTime;
      const timezone = totalGuests[i]?.date.time.timezone;
      let endTime = moment(startTime)
        .add(totalGuests[i]?.services.TotalDuration, 'minutes')
        .utcOffset(timezone)
        .format('YYYY-MM-DDTHH:mm:ssZ');

      let totalDuration = get(totalGuests, `[${i}].services.TotalDuration`, 45);

      let extraNotes = (totalGuests[i].addons || []).reduce((obj, current) => {
        if (current.Duration !== 5) {
          totalDuration += current.Duration;
          endTime = moment(endTime)
            .add(current.Duration, 'minutes')
            .utcOffset(timezone)
            .format('YYYY-MM-DDTHH:mm:ssZ');
        }
        return `${obj} AddOn: ${current.ServiceName}. `;
      }, route.params.Notes || '');

      if (totalGuests[i].extension && totalGuests[i].extension.name === 'Yes') {
        extraNotes = `${extraNotes} Extensions Added.`;
      }

      const guestObj = {
        EmployeeID: totalGuests[i]?.employees,
        RoomID: totalGuests[i]?.rooms,
        StartDateTimeOffset: startTime,
        // EndDateTimeOffset: endTime,
        TreatmentID: totalGuests[i]?.services.ID,
        TotalDuration: totalDuration,
        Guest: {
          FirstName: get(userInfo, 'firstname', ''),
          LastName: get(userInfo, 'lastname', ''),
          Email: get(userInfo, 'preferred_username', ''),
          HomePhone: get(userInfo, 'primaryPhone', ''),
          ID: get(userInfo, 'bookerID', ''),
        },
        AppointmentNotes: extraNotes,
      };
      guestData.push(guestObj);
    }
    return guestData;
  };

  const bookApptGuest = () => {
    let obj = {
      LocationID: get(selectedLocation, 'bookerLocationId', ''),
      GroupName: `${get(userInfo, 'firstname', '')}'s friends`,
      ItineraryItems: guestList(),
    };

    dispatch(createGuestAppointment(obj)).then((res) => {
      if (res.payload && res.payload.IsSuccess) {
        dispatch(getAppointments(get(userInfo, 'bookerID', '')));
        navigation.navigate('Confirmation', {
          apptInfo: res.payload.Appointment,
        });
      }
    });
  };

  const editAppt = async () => {
    if (!fromEdit.group) {
      dispatch(cancelAppointment(fromEdit.appointment));
    } else {
      dispatch(cancelItinerary(fromEdit.group, fromEdit.oldLocation));
    }

    if (totalGuests.length === 1) {
      bookAppt();
    } else {
      bookApptGuest();
    }
  };

  const onApply = (code) => {
    dispatch(
      applyPromoCode(get(selectedLocation, 'bookerLocationId', ''), code),
    );
  };

  const onToggleCancel = () => {
    setShowCancel(!showCancel);
  };

  const onEdit = () => {
    MParticle.logEvent(
      'Change their booking information',
      MParticle.EventType.Other,
      {
        'Source Page': 'Review',
      },
    );
  };

  return (
    <View style={rootStyle.container}>
      <BookingTab />
      <BookingHeader title="REVIEW" safeBackColor={Colors.bg} />

      <View style={rootStyle.innerContainer}>
        <ScrollView>
          <Text>
            Please confirm your details and book your Appointment below
          </Text>
          <View style={styles.locContainer}>
            <Text style={styles.headerText}>Location</Text>

            <Text style={styles.titleText}>{selectedLocation.title}</Text>
            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => navigation.popToTop()}>
              <Image source={Images.edit} />
            </TouchableOpacity>
          </View>

          <View style={styles.boxContainer}>
            <Text style={styles.headerText}>Service</Text>
            {totalGuests.map((e, i, arr) => (
              <View key={i} style={styles.flexContainer}>
                {arr.length > 1 ? (
                  <Text style={[styles.titleText, styles.basisContainer]}>
                    {get(e, 'userType')}
                  </Text>
                ) : null}

                <Text
                  style={[
                    styles.titleText,
                    {width: arr.length > 1 ? '68%' : '85%'},
                  ]}>
                  {get(e.services, 'Name', '')}{' '}
                  <Text style={styles.price}>
                    (${get(e.services, 'Price.Amount', '')})
                  </Text>
                </Text>
              </View>
            ))}

            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => {
                onEdit();
                navigation.navigate('Services');
              }}>
              <Image source={Images.edit} />
            </TouchableOpacity>
          </View>

          <View style={styles.boxContainer}>
            <Text style={styles.headerText}>Add-ons</Text>

            {!isAddon ? (
              <Text style={styles.titleText}>None</Text>
            ) : (
              totalGuests.map((e, i, arr) => {
                if (get(e, 'addons')) {
                  return e.addons.map((item, index) => (
                    <View key={index} style={styles.flexContainer}>
                      {arr.length > 1 ? (
                        <Text style={[styles.titleText, styles.basisContainer]}>
                          {get(e, 'userType')}
                        </Text>
                      ) : null}

                      <Text
                        style={[
                          styles.titleText,
                          {width: arr.length > 1 ? '70%' : '85%'},
                        ]}>
                        {get(item, 'ServiceName', '')}{' '}
                        <Text style={styles.price}>
                          (${get(item, 'PriceInfo.Amount', 0)})
                        </Text>
                      </Text>
                    </View>
                  ));
                }
              })
            )}

            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => {
                onEdit();
                navigation.navigate('Addons');
              }}>
              <Image source={Images.edit} />
            </TouchableOpacity>
          </View>

          {totalGuests.length ? (
            <View style={styles.boxContainer}>
              <Text style={styles.headerText}>Extension</Text>

              {totalGuests.map((e, i) => {
                if (e.extension && e.extension.name === 'Yes') {
                  return (
                    <View key={i} style={styles.flexContainer}>
                      {totalGuests.length > 1 ? (
                        <Text style={[styles.titleText, styles.basisContainer]}>
                          {i === 0 ? 'Me' : `Guest ${i}`}
                        </Text>
                      ) : null}

                      <Text
                        style={[
                          styles.titleText,
                          {width: totalGuests.length > 1 ? '70%' : '85%'},
                        ]}>
                        Extension
                        <Text style={styles.price}>
                          (${get(extensionAddon, 'Price.Amount', '')})
                        </Text>
                      </Text>
                    </View>
                  );
                } else {
                  return null;
                }
              })}

              <TouchableOpacity
                style={styles.editContainer}
                onPress={() => {
                  dispatch(setExtensionType(true));
                  navigation.navigate('Addons');
                }}>
                <Image source={Images.edit} />
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={styles.boxContainer}>
            <Text style={styles.headerText}>Date & Time</Text>

            {totalGuests.length > 1 ? (
              <Text style={styles.titleText}>
                {moment(get(totalGuests, '[0].date.time.startDateTime'))
                  .utcOffset(get(totalGuests, '[0].date.time.timezone'))
                  .format('MMMM DD, YYYY')}
              </Text>
            ) : null}

            {totalGuests.map((e, i, arr) =>
              arr.length > 1 ? (
                <>
                  <View style={[styles.flexContainer, {marginTop: 10}]}>
                    <Text style={[styles.titleText, styles.basisContainer]}>
                      {get(e, 'userType')}
                    </Text>
                    <Text style={styles.titleText}>
                      {moment(e.date.time.startDateTime)
                        .utcOffset(e.date.time.timezone)
                        .format('h:mm a')}
                    </Text>
                  </View>
                </>
              ) : (
                <Text key={i} style={styles.titleText}>
                  {moment(e.date.time.startDateTime)
                    .utcOffset(e.date.time.timezone)
                    .format('MMMM DD, YYYY')}{' '}
                  at{' '}
                  {moment(e.date.time.startDateTime)
                    .utcOffset(e.date.time.timezone)
                    .format('h:mm a')}
                </Text>
              ),
            )}
            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => {
                onEdit();
                navigation.navigate('DateTime');
              }}>
              <Image source={Images.edit} />
            </TouchableOpacity>
          </View>

          <PromoInput onApply={onApply} promoInfo={promoInfo} />

          <View
            style={[
              styles.totalContainer,
              {marginTop: 25},
              !promoInfo && {marginBottom: 5},
            ]}>
            <Text style={styles.titleText}>Estimated Total *</Text>
            <Text style={[styles.headerText, styles.price, {fontSize: 18}]}>
              ${estimateTotal}
            </Text>
          </View>

          {promoInfo && (
            <>
              <View style={styles.totalContainer}>
                <Text style={styles.titleText}>Discount *</Text>
                <Text style={[styles.headerText, styles.price, {fontSize: 18}]}>
                  {promoInfo && promoInfo.DiscountType === 0
                    ? `$${promoInfo.DiscountAmount}`
                    : `${promoInfo.DiscountAmount}%`}
                </Text>
              </View>
              <View style={[styles.totalContainer, {marginBottom: 5}]}>
                <Text style={styles.titleText}>Net Total *</Text>
                <Text style={[styles.headerText, styles.price, {fontSize: 18}]}>
                  $
                  {estimateTotal -
                    (promoInfo.DiscountType
                      ? (promoInfo.DiscountAmount / 100) * estimateTotal
                      : promoInfo.DiscountAmount * totalGuests.length)}
                </Text>
              </View>
            </>
          )}

          <TouchableOpacity onPress={onToggleCancel}>
            <View style={styles.cancelContainer}>
              {showCancel ? (
                <Entypo
                  name="circle-with-minus"
                  color={Colors.header_title}
                  size={20}
                />
              ) : (
                <Entypo
                  name="circle-with-plus"
                  color={Colors.header_title}
                  size={20}
                />
              )}

              <Text style={styles.cancelText}>
                Cancellation & No-Show Policy
              </Text>
            </View>
            {showCancel && (
              <Text style={styles.notice}>
                You may cancel up to 2 hours before the start of your
                appointment. By entering your credit card information, you agree
                to accept a $20 cancellation fee if you cancel within 2 hours of
                the start of your appointment or do not show up. For group
                appointments of six or less, your card will be charged for any
                in the party who cancel within 2 hours or do not show up.
              </Text>
            )}
          </TouchableOpacity>

          <CheckBox
            isChecked={isChecked}
            onPressed={() => setChecked(!isChecked)}
            title="Yes, I understand this policy"
          />

          <Button
            disabled={!isChecked}
            name={
              fromEdit ? 'Update this Appointment' : 'Book this Appointment'
            }
            containerStyle={{marginTop: 10}}
            onButtonPress={() => {
              fromEdit
                ? editAppt()
                : totalGuests.length > 1
                ? bookApptGuest()
                : bookAppt();
            }}
          />

          <Text style={styles.notice}>
            You will not be charged until after your appointment
          </Text>

          <View style={styles.bottomContainer}>
            <Text style={styles.notice}>*</Text>
            <Text style={[styles.notice, {marginLeft: 10}]}>
              If you're a Barfly, your additional discounts will be taken
              in-shop at time of appointment.
            </Text>
          </View>
        </ScrollView>
      </View>

      {isLoading || isPromo ? <Indicator /> : null}
    </View>
  );
};

export default Review;

const styles = StyleSheet.create({
  locContainer: {
    minHeight: 90,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.seprator,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginTop: 20,
    ...rootStyle.shadow,
  },
  headerText: {
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextBold,
  },
  titleText: {
    fontSize: 18,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
    marginTop: 2,
  },
  boxContainer: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginTop: 8,
    minHeight: 90,
    ...rootStyle.shadow,
    paddingVertical: 10,
  },
  price: {
    fontFamily: Fonts.AvenirNextMedium,
  },
  totalContainer: {
    height: 68,
    backgroundColor: Colors.dimGray,
    // marginTop: 25,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    flexDirection: 'row',
    // marginBottom: 5,
  },
  cancelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  cancelText: {
    fontSize: 18,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextMedium,
    marginLeft: 10,
  },
  notice: {
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
  },
  bottomContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 30,
  },
  editContainer: {
    position: 'absolute',
    right: 10,
  },
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  basisContainer: {
    flexBasis: '30%',
  },
});
