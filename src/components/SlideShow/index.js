import React, {useState} from 'react';
import Button from 'components/Button';
import {Colors, Fonts, Images} from 'constant';
import {View, Image, StyleSheet, ScrollView} from 'react-native';
import rootStyle from 'rootStyle';
import {get} from 'lodash';

const SlideShow = ({item, navigation, showModal}) => {
  const [activeScreen, setActiveScreen] = useState(0);

  const onScrollEnd = (e) => {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = 250;

    let pageNum = Math.floor(contentOffset.x / viewSize);
    setActiveScreen(pageNum);
  };

  return (
    <>
      <ScrollView
        decelerationRate={0}
        snapToInterval={295}
        snapToAlignment={'start'}
        horizontal
        onMomentumScrollEnd={onScrollEnd}>
        {/* {get(item, 'gallery.images').map((e, i) => ( */}
        {item.map((e, i) => (
          <View key={i} style={[styles.container, rootStyle.shadow]}>
            <Image
              resizeMode="contain"
              source={{uri: get(e, 'images[0]')}}
              style={styles.cardStyle}
            />
            <Button
              onButtonPress={() => {
                showModal(e);
              }}
              name="Show This Model"
              containerStyle={styles.buttonStyle}
              titleStyle={styles.buttonTextStyle}
            />
          </View>
        ))}
      </ScrollView>

      <View style={{flexDirection: 'row', alignSelf: 'center'}}>
        {/* {get(item, 'gallery.images').map((e, i) => { */}
        {item.map((e, i) => {
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
      </View>

      <Button
        onButtonPress={() => {
          navigation.navigate('Book');
        }}
        containerStyle={{marginVertical: 30}}
        name="Book This Style"
      />
    </>
  );
};

export default SlideShow;

const styles = StyleSheet.create({
  container: {
    height: 352,
    width: 295,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  buttonStyle: {
    width: '90%',
    alignSelf: 'center',
    height: 36.79,
    backgroundColor: Colors.white,
    borderWidth: 0.7,
    borderColor: '#42413D',
  },
  buttonTextStyle: {
    fontSize: 13,
    fontFamily: Fonts.AvenirNextRegular,
  },
  cardStyle: {
    height: 270,
    width: '100%',
    alignSelf: 'center',
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
