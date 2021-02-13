import {StyleSheet} from 'react-native';
import {Colors, Fonts} from 'constant';

export default StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  headerTitle: {
    // marginLeft: 8,
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextBold,
    marginTop: 10,
  },
  itemContainer: {
    height: 48,
    backgroundColor: Colors.white,
    marginVertical: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    borderBottomWidth: 2,
    borderColor: '#e8e8e6',
    // elevation: 2,
    // shadowColor: Colors.black,
    // shadowOffset: {width: 0, height: 0.5},
    // shadowOpacity: 0.5,
    // shadowRadius: 0.5,
  },
  itemTitle: {
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
  },
  logoutContainer: {
    paddingVertical: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoutBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    height: 40,
    justifyContent: 'space-evenly',
    backgroundColor: Colors.white,
    elevation: 1,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 0.1,
  },
  signOutText: {
    fontSize: 13,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextMedium,
  },
  appVersion: {
    fontSize: 13,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
  },
});
