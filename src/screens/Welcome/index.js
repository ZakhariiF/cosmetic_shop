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
  Images.welcomescreen_book,
];

const {height, width} = Dimensions.get('window');

const Welcome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useDispatch();

  const onTouchEnd = useCallback(
    (_e, s) => {
      if (s.index !== currentSlide) {
        setCurrentSlide(s.index);
      } else {
        setCurrentSlide(currentSlide + 1);
      }
    },
    [currentSlide],
  );

  useEffect(() => {
    if (currentSlide >= 3) {
      dispatch(increaseLoggedInCount());
    }
  }, [currentSlide]);

  return (
    <View style={{flex: 1}}>
      <Slick
        loop={false}
        onTouchEnd={onTouchEnd}
        index={currentSlide}
        dotStyle={{backgroundColor: 'transparent'}}
        activeDotStyle={{backgroundColor: 'transparent'}}>
        {WelcomeImages.map((img, i) => (
          <ImageBackground
            source={img}
            key={i}
            style={{
              width,
              height,
            }}
            resizeMode="stretch"
          />

        ))}
      </Slick>
    </View>
  );
};

export default Welcome;
