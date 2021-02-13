/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  Linking
} from 'react-native';
import AppContainer from './src/navigation';
import AppHoc from './src/hoc';
import {AlertHelper} from 'utils/AlertHelper';
import DropdownAlert from 'react-native-dropdownalert';
// import {oktaConfig} from 'utils';
import {ApolloProvider} from '@apollo/client';
import {GraphQLClient} from 'services/GraphClinet';
import {enableScreens} from 'react-native-screens';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

enableScreens();

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const App = () => {
  React.useEffect(() => {
    AsyncStorage.clear()
    SplashScreen.hide();
    handleScaling();
  }, []);

  const onCallback = (event) => {
    console.log('onCallback:', event)
  }

  // React.useEffect(() => {
  //   // Linking.getInitialURL().then((url) => {
  //   //   if (url) {
  //   //     console.log('Initial url is: ' + url);
  //   //   }
  //   // }).catch(err => console.error('An error occurred', err));

  //   Linking.addEventListener('url', onCallback)
  //   return () => {
  //     Linking.removeEventListener('url', onCallback)
  //   }
  // }, [onCallback])

  const handleScaling = () => {
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;

    TouchableOpacity.defaultProps = TouchableOpacity.defaultProps || {};
    TouchableOpacity.defaultProps.activeOpacity = 0.7;

    ScrollView.defaultProps = ScrollView.defaultProps || {};
    ScrollView.defaultProps.showsVerticalScrollIndicator = false;
    ScrollView.defaultProps.showsHorizontalScrollIndicator = false;
  };

  const {apolloClient} = GraphQLClient();

  return (
    <ApolloProvider client={apolloClient}>
      <AppHoc>
        <AppContainer />
        <DropdownAlert
          inactiveStatusBarStyle="light-content"
          ref={(ref) => AlertHelper.setDropDown(ref)}
          onClose={() => AlertHelper.invokeOnClose()}
        />
      </AppHoc>
    </ApolloProvider>
  );
};

export default App;
