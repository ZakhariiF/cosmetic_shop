import {Colors, Fonts} from 'constant';
import {StyleSheet} from 'react-native';
import rootStyle from 'rootStyle';

export default StyleSheet.create({
  topImg: {
    height: 230,
    width: '100%',
    backgroundColor: Colors.white,
  },
  topImage: {
    height: 230,
    width: '100%',
  },
  writeMsg: {
    marginTop: 20,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: Fonts.AvenirNextBold,
    color: Colors.header_title,
  },
  inputContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
    backgroundColor: Colors.white,
    paddingBottom: 25,
    ...rootStyle.shadow,
    marginBottom: 20,
  },
  yourmsg: {
    fontSize: 16,
    fontFamily: Fonts.AvenirNextBold,
    color: Colors.header_title,
  },
  input: {
    height: 312,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.seprator,
    marginTop: 10,
    fontFamily: Fonts.AvenirNextItalic,
    paddingTop: 10,
    backgroundColor: Colors.white,
    paddingHorizontal: 15,
    width: '100%',
    alignSelf: 'center',
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: '10%',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  instaContainer: {
    height: 150,
    width: '49%',
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instaName: {
    fontSize: 16,
    fontFamily: Fonts.AvenirNextBold,
    color: Colors.header_title,
    marginTop: 8,
  },
  serviceContainer: {
    backgroundColor: Colors.white,
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  serviceHeader: {
    ...rootStyle.commonText,
    color: Colors.light_brown,
  },
  serviceInnerCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  callIcon: {
    height: 20,
    width: 20,
    tintColor: Colors.header_title,
  },
  number: {
    fontSize: 16,
    fontFamily: Fonts.AvenirNextBold,
    color: Colors.header_title,
  },
  dotContainer: {
    marginVertical: 40,
  },
  bottomIcon: {
    width: '97%',
    height: '95%',
  },
  bottomImg: {
    width: '100%',
    backgroundColor: Colors.white,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    ...rootStyle.shadow,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    fontWeight: '400',
    marginTop: 10,
  },
  label: {
    fontSize: 15,
    color: Colors.light_gray,
    marginTop: 25,
    fontFamily: Fonts.AvenirNextRegular,
  },
});
