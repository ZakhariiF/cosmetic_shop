import {StyleSheet} from 'react-native';
import {Colors, Fonts} from 'constant';

export default StyleSheet.create({
  spaceBox: {
    marginTop: 10,
  },
  warning: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexDirection: 'row',
    backgroundColor: Colors.white,
  },
  warnText: {
    fontSize: 13,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
    marginLeft: 8,
  },
});
