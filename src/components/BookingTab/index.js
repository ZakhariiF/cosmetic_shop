import React, {useRef} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {Colors, Fonts, Images} from 'constant';
import {useNavigation, useNavigationState} from '@react-navigation/native';
import rootStyle from 'rootStyle';
import {updateRouteName} from 'utils';
import colors from 'constant/colors';

const hiddenTabs = ['ShopDetail', 'BookingForm', 'Stylists'];

const BookingTab = ({}) => {
  const scrollRef = useRef(null);
  const routes = useNavigationState((state) => state.routes);
  const allRoutes = useNavigationState((state) => state.routeNames);
  const currentRoute = routes[routes.length - 1].name;

  let beforeRoute = allRoutes
    .slice(0, allRoutes.indexOf(currentRoute))
    .filter((r) => !hiddenTabs.includes(r));
  let afterRoute = allRoutes
    .slice(allRoutes.indexOf(currentRoute) + 1, allRoutes.length)
    .filter((r) => !hiddenTabs.includes(r));

  const navigation = useNavigation();

  return (
    <>
      <SafeAreaView style={{backgroundColor: Colors.white}} />

      <View style={styles.container}>
        <View style={{flex: 1}}>
          <ScrollView
            onContentSizeChange={(width, height) =>
              scrollRef.current.scrollTo({x: width})
            }
            ref={scrollRef}
            horizontal
            scrollEnabled={false}
            contentContainerStyle={styles.firstContainer}>
            {beforeRoute.map((e, i) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Book', {
                      screen: e,
                    });
                  }}
                  accessible
                  accessibilityLabel="Book"
                  accessibilityRole="link">
                  <Text key={i} style={styles.routeName}>
                    {updateRouteName(e)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <Text style={styles.currenRoute}>{updateRouteName(currentRoute)}</Text>

        <View style={{flex: 1}}>
          <ScrollView
            horizontal
            scrollEnabled={false}
            contentContainerStyle={styles.lastContainer}>
            {afterRoute.map((e, i) => {
              if (
                e === 'Addcc' ||
                e === 'Confirmation' ||
                e === 'ShopDetail' ||
                e === 'Stylists'
              ) {
                return;
              } else {
                return (
                  <Text key={i} style={[styles.routeName, {color: colors.light_gray}]}>
                    {updateRouteName(e)}
                  </Text>
                );
              }
            })}
          </ScrollView>
        </View>
      </View>
      <View style={styles.seprator} />
      <Image source={Images.polygon} style={styles.polygonIcon} />
    </>
  );
};

export default BookingTab;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    backgroundColor: Colors.white,
  },
  seprator: {
    height: 5,
    backgroundColor: Colors.yellow,
    width: '52%',
  },
  currenRoute: {
    ...rootStyle.commonText,
    fontFamily: Fonts.AvenirNextBold,
    marginHorizontal: 15,
  },
  routeName: {
    ...rootStyle.commonText,
    marginHorizontal: 10,
  },
  firstContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  polygonIcon: {
    left: '48%',
    bottom: 14,
  },
  lastContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
});
