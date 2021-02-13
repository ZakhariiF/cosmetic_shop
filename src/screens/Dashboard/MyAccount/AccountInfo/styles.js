import {StyleSheet} from 'react-native';
import {Colors, Fonts} from 'constant';

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.seprator,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    color: Colors.header_title,
    fontFamily: Fonts.Evan,
    lineHeight: 20,
    marginTop: 20,
  },
  emailContainer: {
    height: 80,
    justifyContent: 'center',
    marginBottom: -20,
    marginTop: 5,
  },
  emailHeader: {
    fontSize: 15,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.light_gray,
  },
  email: {
    fontSize: 20,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.light_gray,
  },
  underlineText: {
    fontSize: 13,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
    textDecorationLine: 'underline',
  },
  desc: {
    fontSize: 13,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.input_color,
    marginTop: 8,
  },
  profileIcon: {
    height: 20,
    width: 20,
    tintColor: Colors.yellow,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    marginBottom: 20,
  },
});
