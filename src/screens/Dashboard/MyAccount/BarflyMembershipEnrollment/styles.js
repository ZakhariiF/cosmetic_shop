import {Colors, Fonts} from 'constant';
import {StyleSheet} from 'react-native';
import rootStyle from 'rootStyle';

export default StyleSheet.create({
  errorText: {
    color: Colors.red,
    fontSize: 12
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.input_color,
    fontSize: 16,
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.input_text,
    marginBottom: 10,
    paddingBottom: 4,
  },
  inputLabel: {
    marginBottom: 0,
    paddingBottom: 0
  },
  title: {
    color: Colors.header_title,
    fontSize: 18,
    lineHeight: 45
  },
  birthdayWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row'
  },
  birthdayElem:{
    width: '33%'
  }
});
