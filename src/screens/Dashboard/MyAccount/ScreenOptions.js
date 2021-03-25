import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text, Image} from 'react-native';
import {Colors, Fonts} from 'constant';
import {screenOptions} from 'constant/Staticarray';
import rootStyle from 'rootStyle';

const ScreenOptions = ({navigation}) => {
  const onTabPress = (index) => {
    if (index === 0) {
      navigation.navigate('My Appts');
    }

    if (index === 1) {
      navigation.navigate('AccountInfo');
    }

    if (index === 2) {
      navigation.navigate('BarflyMembership');
    }

    return;
  };

  return (
    <View style={styles.container}>
      {screenOptions.map((e, i) => (
        <TouchableOpacity
          onPress={() => onTabPress(i)}
          key={i}
          style={styles.box}
          accessible
          accessibilityLabel={e.name}
          accessibilityRole="link">
          <View
            style={[
              styles.circle,
              i === 2 && {
                justifyContent: 'flex-start',
              },
            ]}>
            <Image resizeMode="contain" source={e.icon} style={e.style} />
          </View>
          <Text style={styles.label}>{e.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ScreenOptions;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: '6%',
    marginTop: 20,
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    textAlign: 'center',
    fontFamily: Fonts.AvenirNextRegular,
    color: Colors.header_title,
  },
  focusedBox: {
    backgroundColor: Colors.yellow,
    borderColor: Colors.yellow,
  },
  icon: {
    height: 26,
    width: 26,
  },
  circle: {
    height: 72,
    width: 72,
    borderWidth: 1,
    borderRadius: 72 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderColor: Colors.seprator,
    backgroundColor: Colors.white,
    ...rootStyle.shadow,
  },
});
