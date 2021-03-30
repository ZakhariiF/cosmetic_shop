import {Colors, Fonts} from 'constant';
import {StyleSheet} from 'react-native';
import rootStyle from 'rootStyle';

export default StyleSheet.create({
  topImage: {
    height: 230,
    width: '100%',
  },
  topContainer: {
    padding: '10%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.seprator,
  },
  headingText: {
    ...rootStyle.commonText,
    alignSelf: 'center',
    textAlign: 'center',
  },
  descText: {
    ...rootStyle.commonText,
    alignSelf: 'center',
    // marginTop: 8,
    fontFamily: Fonts.AvenirNextBold,
    textAlign: 'center',
  },
  listContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 10,
  },
  bottomIcon: {
    width: '97%',
    height: '95%',
  },
  buttonContainer: {
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: Colors.primary,
  },
  bottomImg: {
    width: '100%',
    backgroundColor: Colors.white,
    height: 200,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...rootStyle.shadow,
  },
});
