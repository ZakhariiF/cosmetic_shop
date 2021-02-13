import {Colors, Fonts} from 'constant';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  topImage: {
    height: 230,
    width: '100%',
  },
  topText: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 50,
    textAlign: 'center',
    fontFamily: Fonts.DCondensed,
    lineHeight: 64,
  },
  desc: {
    textAlign: 'center',
    alignSelf: 'center',
    marginHorizontal: '10%',
    fontFamily: Fonts.AvenirNextRegular,
    fontSize: 18,
    color: Colors.header_title,
  },
  swiperTextStyle: {
    fontSize: 30,
    fontFamily: Fonts.DCondensed,
    padding: 30,
    color: '#42413D',
  },
  swiperContainer: {
    height: 375,
    width: '100%',
    marginTop: 30,
  },
  imageStyle: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
  },
  buttonStyle: {
    width: '55%',
    alignSelf: 'center',
    height: 36.79,
    backgroundColor: 'transparent',
    marginVertical: 30,
    borderWidth: 1,
    borderColor: '#A8A8A8',
  },
  buttonTextStyle: {
    fontSize: 13,
  },
  playerContainer: {
    width: '100%',
    borderWidth: 15,
    borderColor: '#E2E2E2',
    marginVertical: 20,
  },
  playIcon: {
    alignSelf: 'center',
    top: '40%',
    position: 'absolute',
  },
});
