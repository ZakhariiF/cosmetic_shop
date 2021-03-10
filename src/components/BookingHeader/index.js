import React from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import Header from 'components/Header/Header';

const BookingFlowScreens = [
  'Location',
  'Coming',
  'Services',
  'Addons',
  'DateTime',
  'Notes',
  'ApptHold',
  'Review',
  'Confirmation',
];

const BookingHeader = (props) => {
  const route = useRoute();
  const navigation = useNavigation();

  const onBackPress = () => {
    if (props.onBackdropPress) {
      props.onBackdropPress();
    } else {
      const idx = BookingFlowScreens.indexOf(route.name);
      if (idx > 0) {
        navigation.navigate('Book', {screen: BookingFlowScreens[idx - 1]});
      }
    }
  };
  return <Header {...{...props, onBackPress}} />;
};

export default BookingHeader;
