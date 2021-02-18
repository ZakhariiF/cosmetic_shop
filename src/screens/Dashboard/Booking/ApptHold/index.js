import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView, Dimensions} from 'react-native';
import Header from 'components/Header/Header';
import {Colors, Fonts, Images} from 'constant';
import rootStyle from 'rootStyle';
import CreditCardDisplay from 'react-native-credit-card-display';
import Button from 'components/Button';
import BookingTab from 'components/BookingTab';
import LocationModal from 'components/LocationModal';
import Indicator from 'components/Indicator';
import {getCreditCard} from '../thunks';
import {useDispatch, useSelector} from 'react-redux';
import {get} from 'lodash';
import EmptyContainer from 'components/EmptyContainer';

const {width} = Dimensions.get('screen');

const ApptHold = ({navigation, route}) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const isLoading = useSelector((state) => state.booking.isCCLoading);
  const customerCards = useSelector((state) => state.booking.customerCards);
  const selectedLocation = useSelector((state) => state.booking.selectedLocation);
  const [activeScreen, setActiveScreen] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(
        getCreditCard(
          get(userInfo, 'profile.bookerId', ''),
          selectedLocation.bookerLocationId,
        ),
      );
    });
    return unsubscribe;
  }, [navigation]);

  const handleScroll = (event) => {
    const itemWidth = Dimensions.get('window').width - 150;
    let currentIndex = parseInt(event.nativeEvent.contentOffset.x / itemWidth);
    setActiveScreen(currentIndex);
  };

  return (
    <View style={rootStyle.container}>
      <BookingTab />
      <View style={rootStyle.sizeBox} />
      <Header title="APPOINTMENT HOLD" safeBackColor={Colors.bg} />
      <View style={rootStyle.innerContainer}>
        <View style={rootStyle.seprator} />

        <Text style={styles.heading}>
          Select credit card to hold your appointment.
        </Text>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {customerCards.length ? (
            <>
              <View>
                <ScrollView
                  decelerationRate={0}
                  snapToInterval={width - 70}
                  snapToAlignment={'center'}
                  horizontal
                  onScroll={handleScroll}>
                  {customerCards.map((e, i) => {
                    return (
                      <View
                        key={i}
                        style={[
                          activeScreen === i && {borderWidth: 1.2},
                          styles.cardContainer,
                        ]}>
                        <CreditCardDisplay
                          number={`0000 0000 0000 ${get(
                            e,
                            'CreditCard.Number',
                          )}`}
                          name={get(e, 'CreditCard.NameOnCard')}
                          frontImage={Images.cardImageFront}
                          backImage={Images.cardImageBack}
                        />
                      </View>
                    );
                  })}
                </ScrollView>
              </View>

              <Button
                name="Use Selected Card"
                containerStyle={{marginTop: 50}}
                onButtonPress={() =>
                  navigation.navigate('Review', {
                    Notes: route.params.Notes,
                  })
                }
              />
            </>
          ) : (
            !isLoading && <EmptyContainer emptyText="No Card Found" />
          )}

          <Button
            isWhite
            name="Add Card"
            containerStyle={styles.addCard}
            onButtonPress={() => navigation.navigate('Addcc')}
            // onButtonPress={() => navigation.navigate('Review')}
          />
        </ScrollView>
      </View>

      <LocationModal />

      {isLoading ? <Indicator /> : null}
    </View>
  );
};

export default ApptHold;

const styles = StyleSheet.create({
  heading: {
    alignSelf: 'center',
    marginVertical: 20,
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
  },
  addCard: {
    marginTop: 2,
  },
  cardContainer: {
    marginRight: 10,
    padding: 5,
    borderRadius: 10,
    borderColor: Colors.card_border,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: '18%',
  },
});
