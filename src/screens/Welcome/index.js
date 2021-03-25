import React, {useState, useEffect, useCallback} from 'react';
import {ImageBackground, View} from 'react-native';
import Slick from 'react-native-slick';
import {Dimensions} from 'react-native';
import {Images} from 'constant';
import {useDispatch} from 'react-redux';

import {increaseLoggedInCount} from '../Auth/thunks';

const WelcomeImages = [
  Images.welcomescreen_book,
  Images.welcomescreen_appts,
  Images.welcomescreen_myacct,
];

const {height, width} = Dimensions.get('window');

const Welcome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useDispatch();

  const onTouchEnd = useCallback(
    (_e) => {
      setCurrentSlide(currentSlide + 1);
    },
    [currentSlide],
  );

  useEffect(() => {
    if (currentSlide >= 3) {
      dispatch(increaseLoggedInCount());
    }
  }, [currentSlide]);

  const img = WelcomeImages[currentSlide];

  return (
    <View style={{flex: 1}} onTouchEnd={onTouchEnd} onTouchMove={() => dispatch(increaseLoggedInCount())}>
      <ImageBackground
        source={img}
        style={{
          width,
          height,
        }}
        resizeMode="stretch"
      />
    </View>
  );
};

export default Welcome;
