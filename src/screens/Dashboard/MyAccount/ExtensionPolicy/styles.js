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
  headerText: {
    fontSize: 30,
    textAlign: 'center',
    color: Colors.header_title,
  },
  p: {
    ...rootStyle.commonText,
  },
});
