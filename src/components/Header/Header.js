import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  isUppercaseTitle,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors, Fonts, Images} from 'constant';
import colors from 'constant/colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import MParticle from 'react-native-mparticle';
import rootStyle from 'rootStyle';

const Header = ({
  title,
  onBackPress,
  isBack = true,
  isTab,
  safeBackColor,
  isNext,
  onNext,
  isSave,
  onSave,
}) => {
  const navigation = useNavigation();

  const route = useRoute();

  return (
    <>
      <SafeAreaView style={{backgroundColor: safeBackColor || Colors.white}} />
      <View
        style={[
          styles.container,
          {backgroundColor: isTab ? Colors.white : Colors.bg},
        ]}>
        {isBack ? (
          <MaterialIcons
            name="arrow-back-ios"
            size={25}
            onPress={
              onBackPress
                ? onBackPress
                : () => {
                    MParticle.logEvent('Back', MParticle.EventType.Navigation, {
                      'Source Page': route.name,
                    });
                    navigation.goBack();
                  }
            }
          />
        ) : (
          <View style={{width: 30}} />
        )}

        <Text
          style={
            isUppercaseTitle
              ? [styles.title, styles.isUppercaseTitle]
              : [styles.title]
          }>
          {title}
        </Text>
        {isNext ? (
          <TouchableOpacity style={styles.rightContainer} onPress={onNext}>
            <Text style={styles.next}>NEXT</Text>
            <Image source={Images.right_arrow} />
          </TouchableOpacity>
        ) : isSave ? (
          <TouchableOpacity style={styles.rightContainer} onPress={onSave}>
            <Text style={styles.next}>SAVE</Text>
          </TouchableOpacity>
        ) : (
          <View style={{width: 30}} />
        )}
      </View>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: Colors.bg,
    height: 70,
  },
  title: {
    fontSize: 28,
    color: colors.header_title,
    fontFamily: Fonts.DCondensed,
    flex: 1,
    textAlign: 'center',
    marginTop: 5,
  },
  isUppercaseTitle: {
    textTransform: 'uppercase',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  next: {
    ...rootStyle.commonText,
    fontSize: 13,
    marginRight: 5,
    fontFamily: Fonts.AvenirNextMedium,
  },
});
