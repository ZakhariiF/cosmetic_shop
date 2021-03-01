import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Colors, Fonts, Images} from 'constant';
import rootStyle from 'rootStyle';
import {useSelector} from 'react-redux';
import {get} from 'lodash';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';

const ReviewPopup = ({}) => {
  const navigation = useNavigation();
  const totalGuests = useSelector((state) => state.booking.totalGuests);
  const selectedLocation = useSelector(
    (state) => state.booking.selectedLocation,
  );
  const extensionAddon = useSelector((state) => state.booking.extensionAddon);
  const [estimateTotal, setTotal] = useState(0);
  const [isAddon, setisAddOn] = useState(false);

  useEffect(() => {
    calculateTotal();
    checkAddonData();
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
          (val, item) => get(item, 'Price.Amount', 0) + val,
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

  return (
    <View style={styles.container}>
      <View style={rootStyle.innerContainer}>
        <ScrollView>
          <View style={styles.locContainer}>
            <Text style={styles.headerText}>Location</Text>

            <Text style={styles.titleText}>{selectedLocation.title}</Text>
            <TouchableOpacity
              style={styles.editContainer}
              onPress={() => navigation.popToTop()}>
              <Image source={Images.edit} />
            </TouchableOpacity>
          </View>

          {totalGuests.length && get(totalGuests, '[0].services') ? (
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
                onPress={() => navigation.navigate('Services')}>
                <Image source={Images.edit} />
              </TouchableOpacity>
            </View>
          ) : null}

          {totalGuests.length && get(totalGuests, '[0].addons') ? (
            <View style={styles.boxContainer}>
              <Text style={styles.headerText}>Add-ons</Text>

              {!isAddon ? (
                <Text style={styles.titleText}>None </Text>
              ) : (
                totalGuests.map((e, i, arr) => {
                  if (get(e, 'addons')) {
                    return e.addons.map((item, index) => (
                      <View key={index} style={styles.flexContainer}>
                        {arr.length > 1 ? (
                          <Text
                            style={[styles.titleText, styles.basisContainer]}>
                            {get(e, 'userType')}
                          </Text>
                        ) : null}

                        <Text
                          style={[
                            styles.titleText,
                            {width: arr.length > 1 ? '70%' : '85%'},
                          ]}>
                          {get(item, 'Name', '')}{' '}
                          <Text style={styles.price}>
                            (${get(item, 'Price.Amount', '')})
                          </Text>
                        </Text>
                      </View>
                    ));
                  }
                })
              )}

              <TouchableOpacity
                style={styles.editContainer}
                onPress={() => navigation.navigate('Addons')}>
                <Image source={Images.edit} />
              </TouchableOpacity>
            </View>
          ) : null}

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
                onPress={() => navigation.navigate('Addons')}>
                <Image source={Images.edit} />
              </TouchableOpacity>
            </View>
          ) : null}

          {totalGuests.length && get(totalGuests, '[0].date') ? (
            <View style={styles.boxContainer}>
              <Text style={styles.headerText}>Date & Time</Text>

              {totalGuests.length > 1 ? (
                <Text style={styles.titleText}>
                  {moment(get(totalGuests, '[0].date.date')).format(
                    'MMMM DD, YYYY',
                  )}
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
                        {moment(get(e, 'date.time.open')).format('h:mm a')}
                      </Text>
                    </View>
                  </>
                ) : (
                  <Text key={i} style={styles.titleText}>
                    {moment(get(e, 'date.date')).format('MMMM DD, YYYY')} at{' '}
                    {moment(get(e, 'date.time.open')).format('h:mm a')}
                  </Text>
                ),
              )}
              <TouchableOpacity
                style={styles.editContainer}
                onPress={() => navigation.navigate('DateTime')}>
                <Image source={Images.edit} />
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={styles.totalContainer}>
            <Text style={styles.titleText}>Estimated Total *</Text>
            <Text style={[styles.headerText, styles.price, {fontSize: 18}]}>
              ${estimateTotal}
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ReviewPopup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  locContainer: {
    minHeight: 90,
    backgroundColor: Colors.bg,
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
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginTop: 15,
    minHeight: 90,
    paddingVertical: 10,
    ...rootStyle.shadow,
  },
  price: {
    fontFamily: Fonts.AvenirNextMedium,
  },
  totalContainer: {
    height: 68,
    backgroundColor: Colors.dimGray,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    flexDirection: 'row',
    marginBottom: 5,
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
