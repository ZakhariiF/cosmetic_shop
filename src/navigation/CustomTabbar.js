import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StyleSheet,
} from 'react-native'
import {CommonActions} from '@react-navigation/native';

import {Colors, Fonts} from '../constant';
import {renderTabImages} from '../utils';

const CustomTabbar = ({state, descriptors, navigation}) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  key: null,
                  routes: [{ name: route.name }],
                }),
              );
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[styles.tabContainer, isFocused && styles.focusedTab]}>
              <Image
                style={index === 3 && styles.profileIcon}
                source={renderTabImages(index)}
              />

              <Text
                style={[styles.tabLabel, isFocused && styles.focusedTablabel]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default CustomTabbar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    height: 62,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabContainer: {
    width: '24.5%',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.bg,
    borderBottomWidth: 5,
    borderBottomColor: 'transparent',
  },
  focusedTab: {
    backgroundColor: Colors.white,
    borderBottomWidth: 5,
    borderBottomColor: Colors.yellow,
  },
  tabLabel: {
    fontSize: 13,
    color: Colors.header_title,
    fontFamily: Fonts.AvenirNextRegular,
  },
  focusedTablabel: {
    fontFamily: Fonts.AvenirNextBold,
  },
  profileIcon: {
    height: 20,
    width: 20,
  },
});
