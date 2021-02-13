import {StyleSheet} from 'react-native';
import {Colors, Fonts} from 'constant';

export default StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 18,
    color: Colors.header_title,
    fontFamily: Fonts.Evan,
    lineHeight: 20,
    marginTop: 30,
  },
  favShop: {
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.Evan,
    marginTop: 25,
    lineHeight: 20,
  },
  emptyContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    marginVertical: 10,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
    lineHeight: 20,
  },
});
