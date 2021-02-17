import {Colors} from 'constant';
import React, {useState} from 'react';
import {View, Image, ScrollView, StyleSheet} from 'react-native';
import {get} from 'lodash';

const CustomSwiper = ({images}) => {
  const [activeScreen, setActiveScreen] = useState(0);

  const onScrollEnd = (e) => {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = 80;

    let pageNum = Math.floor(contentOffset.x / viewSize);
    setActiveScreen(pageNum);
  };

  return (
    <View style={{marginTop: 15}}>
      <ScrollView
        decelerationRate={0}
        snapToInterval={140}
        snapToAlignment={'start'}
        horizontal
        onMomentumScrollEnd={onScrollEnd}
        contentInset={{
          top: 0,
          left: 10,
          bottom: 0,
          right: 10,
        }}>
        {images.map((e, i) => {
          return (
            <Image
              key={i}
              resizeMode="contain"
              style={styles.imageContainer}
              source={{
                uri: get(e, 'mobileMedia.url') || get(e, 'desktopMedia.url')
              }}
            />
          );
        })}
      </ScrollView>
      {/* <View style={{flexDirection: 'row', alignSelf: 'center'}}>
        {[1, 2, 3, 4].map((e, i) => {
          return (
            <View
              key={i}
              style={[
                styles.dot,
                activeScreen === i && {backgroundColor: Colors.empty},
              ]}
            />
          );
        })}
      </View> */}
    </View>
  );
};

export default CustomSwiper;

const styles = StyleSheet.create({
  imageContainer: {
    width: 140,
    height: 140,
    marginLeft: 5,
  },
  dot: {
    height: 8,
    width: 8,
    backgroundColor: Colors.dashed,
    borderRadius: 4,
    marginHorizontal: 2,
    marginTop: 15,
  },
});
