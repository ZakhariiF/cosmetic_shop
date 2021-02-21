import {Colors, Fonts} from 'constant';
import {StyleSheet} from 'react-native';
import rootStyle from 'rootStyle';

export default StyleSheet.create({
  topContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 8,
    backgroundColor: Colors.white,
    marginTop: 12,
    ...rootStyle.shadow,
  },
  toggleContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.seprator,
    backgroundColor: Colors.white,
    marginTop: 12,
    ...rootStyle.shadow,
  },
  a: {
    fontFamily: Fonts.Evan,
    lineHeight: 20,
    fontSize: 15,
    color: Colors.header_title,
    flexBasis: '85%',
  },
  p: {
    ...rootStyle.commonText,
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dotView: {
    height: 4,
    width: 4,
    backgroundColor: Colors.seprator,
    borderRadius: 4,
    marginTop: 8,
    marginRight: 10,
  },
});
