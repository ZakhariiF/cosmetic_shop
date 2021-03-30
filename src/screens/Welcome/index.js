import React, {useState, useEffect, useCallback} from 'react';
import {Image, View} from 'react-native';

import {Images} from 'constant';
import {useDispatch} from 'react-redux';

import {increaseLoggedInCount} from '../Auth/thunks';

const WelcomeImages = [
  Images.welcomescreen_1,
  Images.welcomescreen_2,
  Images.welcomescreen_3,
  Images.welcomescreen_4,
  Images.welcomescreen_5,
];

const Welcome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useDispatch();

  const onTouchEnd = useCallback(
    (_e) => {
      if (currentSlide < WelcomeImages.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else {
        dispatch(increaseLoggedInCount());
      }
    },
    [currentSlide],
  );

  const img = WelcomeImages[currentSlide];

  return (
    <View style={{flex: 1}} onTouchEnd={onTouchEnd} onTouchMove={() => dispatch(increaseLoggedInCount())}>
      <Image
        source={img}
        style={{
          height: '100%',
          width: 'auto',
        }}
        resizeMode="contain"
      />
    </View>
  );
};

export default Welcome;
