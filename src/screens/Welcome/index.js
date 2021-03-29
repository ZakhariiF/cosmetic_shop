import React, {useState, useEffect, useCallback} from 'react';
import {Image, View} from 'react-native';

import {Images} from 'constant';
import {useDispatch} from 'react-redux';

import {increaseLoggedInCount} from '../Auth/thunks';

const WelcomeImages = [
  Images.welcomescreen_book,
  Images.welcomescreen_appts,
  Images.welcomescreen_myacct,
];

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
    if (currentSlide >= 2) {
      dispatch(increaseLoggedInCount());
    }
  }, [currentSlide]);

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
