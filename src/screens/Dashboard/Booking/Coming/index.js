import React, {useState, useEffect} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import rootStyle from 'rootStyle';
import Header from 'components/Header/Header';
import Button from 'components/Button';
import {Colors, Fonts} from 'constant';
import Guest from 'components/Guest';
import {useDispatch} from 'react-redux';
import {setActiveGuestTab, setIsEdit, setmemberCount} from '../thunks';
import BookingTab from 'components/BookingTab';
import LocationModal from 'components/LocationModal';
import MParticle from "react-native-mparticle";
import BookingHeader from "components/BookingHeader";

const Coming = ({navigation}) => {
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [guestTab, setGuestTab] = useState(false);

  useEffect(() => {
    dispatch(setIsEdit(false));
  }, []);

  const onDecrement = () => {
    if (count == 1) return;
    setCount(count - 1);
  };

  const onIncrement = () => {
    if (count == 4) return;
    setCount(count + 1);
  };

  const onNext = (val) => {
    let tempArr = [];

    for (let i = 0; i < val; i++) {
      const obj = {
        userType: i == 0 ? 'Me' : `Guest${i}`,
      };
      tempArr.push(obj);
    }
    MParticle.logEvent('Select How Many', MParticle.EventType.Other, {
      'Source Page': 'Book How Many',
      'User Option': 'Me + Guest',
      'Guest Count': val,
    });
    dispatch(setmemberCount(tempArr));
    navigation.navigate('Services');
  };

  const onJust = () => {
    MParticle.logEvent('Select How Many', MParticle.EventType.Other, {
      'Source Page': 'Book How Many',
      'User Option': 'Just Me',
    });
    setGuestTab(false);
    setCount(1);
    onNext(1);
    dispatch(setActiveGuestTab(0));
  };

  return (
    <View style={rootStyle.container}>
      <BookingTab />
      <View style={rootStyle.sizeBox} />
      <BookingHeader title="WHO'S COMING?" safeBackColor={Colors.bg} />
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={styles.scrollContainer}>
        <Button
          isWhite
          name="Just Me"
          onButtonPress={onJust}
          titleStyle={styles.buttonTitle}
        />
        <Button
          isWhite={!guestTab}
          containerStyle={[styles.button, guestTab && rootStyle.activeButton]}
          name="Me & Guest"
          onButtonPress={() => setGuestTab(true)}
          titleStyle={
            guestTab ? rootStyle.activeButtonText : styles.buttonTitle
          }
        />
        {guestTab ? (
          <Guest
            navigation={navigation}
            count={count}
            onDecrement={onDecrement}
            onIncrement={onIncrement}
            onNext={() => onNext(count + 1)}
          />
        ) : null}
      </ScrollView>
      <LocationModal />
    </View>
  );
};

export default Coming;

const styles = StyleSheet.create({
  button: {
    marginTop: 5,
  },
  title: {
    fontSize: 18,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingBottom: '20%',
  },
  buttonTitle: {
    fontFamily: Fonts.AvenirNextRegular,
  },
});
