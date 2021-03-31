import React, {useState, useCallback} from 'react';
import {Dimensions, Image, View} from 'react-native';

const {height, width} = Dimensions.get('window');

import {Images} from 'constant';
import {useDispatch} from 'react-redux';

import {increaseLoggedInCount} from '../Auth/thunks';

const WelcomeImages =
  height > 667
    ? [Images.welcomescreen_1, Images.welcomescreen_2, Images.welcomescreen_3]
    : [
        Images.welcomescreen_low_1,
        Images.welcomescreen_low_2,
        Images.welcomescreen_low_3,
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
    <View
      style={{flex: 1}}
      onTouchEnd={onTouchEnd}
      onTouchMove={() => dispatch(increaseLoggedInCount())}>
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
