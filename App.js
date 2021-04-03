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
import {Colors} from './src/constant';

enableScreens();

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const App = () => {
  React.useEffect(() => {
    AsyncStorage.clear();
    SplashScreen.hide();
    handleScaling();
  }, []);

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
          successColor={Colors.yellow}
          errorColor={'#333333'}
          renderImage={() => <></>}
          ref={(ref) => AlertHelper.setDropDown(ref)}
          onClose={() => AlertHelper.invokeOnClose()}
          renderTitle={(_, data) => {
            return (
              <Text
                style={[
                  _.titleStyle,
                  {color: data.type === 'success' ? Colors.input_text : '#fff'},
                ]}>
                {data.title}
              </Text>
            );
          }}
          renderMessage={(_, data) => {
            return (
              <Text
                style={[
                  _.messageStyle,
                  {color: data.type === 'success' ? Colors.input_text : '#fff'},
                ]}>
                {data.message}
              </Text>
            );
          }}
        />
      </AppHoc>
    </ApolloProvider>
  );
};

export default App;
