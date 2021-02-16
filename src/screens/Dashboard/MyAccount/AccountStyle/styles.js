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
    padding: 10,
    color: '#42413D',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  swiperContainer: {
    height: 400,
    width: '100%',
    marginTop: 30,
  },
  imageStyle: {
    height: 350,
    width: '100%',
    justifyContent: 'flex-end',
    marginBottom: 30,
    position: 'relative',
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
