import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {Colors, Fonts, Images} from 'constant';
import colors from 'constant/colors';
import fonts from 'constant/fonts';
import {get} from 'lodash';

const StyleSwiper = ({
  title,
  imageSource,
  onBrowse,
  data,
  imgField = 'image',
  action,
}) => {
  const [visible, setVisible] = useState(false);
  const [activeScreen, setActiveScreen] = useState(0);

  const onScrollEnd = (e) => {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = 220;

    let pageNum = Math.floor(contentOffset.x / viewSize);
    setActiveScreen(pageNum);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.topContainer}
        onPress={() => setVisible(!visible)}>
        <Text style={styles.headingText}>{title}</Text>
        <Image
          resizeMode="contain"
          style={[
            styles.arrowIcon,
            visible && {transform: [{rotate: '180deg'}]},
          ]}
          source={Images.down_arrow}
        />
      </TouchableOpacity>
      {visible ? (
        <View style={{marginTop: 15}}>
          <ScrollView
            decelerationRate={0}
            snapToInterval={250}
            snapToAlignment={'start'}
            horizontal
            onMomentumScrollEnd={onScrollEnd}>
            {get(data, 'items', []).map((e, i) => {
              const imgUrl = get(e, imgField);
              return (
                <View key={i} style={styles.ladyIcon}>
                  <ImageBackground
                    key={i}
                    resizeMode="cover"
                    style={styles.imageContainer}
                    source={imgUrl ? {uri: imgUrl} : imageSource}>
                    <View style={styles.imageTitleContainer}>
                      <Text style={styles.imageTitleStyle}>
                        {get(e, 'title')}
                      </Text>
                    </View>
                  </ImageBackground>
                </View>
              );
            })}
          </ScrollView>
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            {get(data, 'items', []).map((e, i) => {
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

          <Text onPress={onBrowse} style={styles.browse}>
            {action
              ? get(action, 'title', 'Browse ALL Styles')
              : get(data, 'action.title', 'Browse All Styles')}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default StyleSwiper;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.darkGrey,
    paddingVertical: 20,
  },
  topContainer: {
    height: 35,
    borderBottomWidth: 1,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 8,
    borderBottomColor: Colors.seprator,
    justifyContent: 'space-between',
  },
  headingText: {
    fontSize: 14,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextMedium,
  },
  arrowIcon: {
    height: 14,
    width: 14,
  },
  ladyIcon: {
    width: 240,
    marginHorizontal: 10,
    borderWidth: 0.7,
    height: 250,
    overflow: 'hidden',
  },
  dot: {
    height: 8,
    width: 8,
    backgroundColor: Colors.dashed,
    borderRadius: 4,
    marginHorizontal: 2,
    marginTop: 15,
  },
  browse: {
    marginTop: 35,
    alignSelf: 'center',
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextBold,
    lineHeight: 17,
  },
  imageContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
  },
  imageTitleContainer: {
    minHeight: 40,
    width: '60%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageTitleStyle: {
    fontSize: 13,
    fontFamily: fonts.AvenirNextRegular,
    color: colors.header_title,
  },
});
