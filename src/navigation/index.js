import React, {useEffect, useCallback, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthNavigator, TabStack} from './routes';
import {createStackNavigator} from '@react-navigation/stack';
import {Platform, Alert} from 'react-native';
import Radar from 'react-native-radar';
import {navigationRef} from './RootNavigation';

import {createConfig, getAccessToken} from '@okta/okta-react-native';
import configFile from 'constant/config';
import {useSelector} from 'react-redux';

const Root = createStackNavigator();

const AppContainer = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [token, setToken] = useState(null);

  Radar.on('clientLocation', (result) => {

    // do something with result.location
    console.log('Radar clientLocation:', result);
    Alert.alert('Radar ClientLocation', JSON.stringify(result));
  });

  Radar.on('location', (result) => {

    // do something with result.location, result.user
    console.log('radar clientLocation:', result);
    Alert.alert('Radar Location', JSON.stringify(result));
  });

  const hasRadarPermission = () => {
    // Radar.setUserId('00uca8ebhdc27qHNh1d6');
    Radar.getPermissionsStatus().then((status) => {
      switch (status) {
        case 'GRANTED_BACKGROUND':
          console.log('GRANTED_BACKGROUND Permission granted');
          Radar.startTrackingContinuous();
          break;
        case 'GRANTED_FOREGROUND':
          console.log('GRANTED_FOREGROUND Permission granted');
          requestRadarPermission();
          break;
        case 'DENIED':
          console.log('Radar Denied');
          requestRadarPermission();
          break;
        case 'UNKNOWN':
          console.log('UNKWOWN');
          requestRadarPermission();
          break;
        default:
          break;
      }
    });
  };
  const requestRadarPermission = () => {
    let permisson = Radar.requestPermissions(true);
    console.log('Request Permission Result', permisson);
  };

  useEffect(() => {
    hasRadarPermission();
  }, []);

  const configApp = useCallback(async () => {
    if (Platform.OS === 'ios') {
      await createConfig({
        // issuer: configFile.issuer,
        clientId: configFile.clientId,
        redirectUri: configFile.redirectUri,
        endSessionRedirectUri: configFile.endSessionRedirectUri,
        discoveryUri: configFile.discoveryUri,
        scopes: configFile.scopes,
        requireHardwareBackedKeyStore: false,
      });
    }
  }, []);

  useEffect(() => {
    configApp();
  }, []);

  useEffect(() => {
    if (userInfo) {
      try {
        const t = getAccessToken();
        setToken(t);
      } catch (e) {
        console.log('Get Access Token Error:', e);
      }
    } else {
      setToken(null);
    }
  }, [userInfo]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Root.Navigator headerMode="none">
        {token ? (
          <Root.Screen name="Dashboard" component={TabStack} />
        ) : (
          <Root.Screen name="Auth" component={AuthNavigator} />
        )}
      </Root.Navigator>
    </NavigationContainer>
  );
};

export default AppContainer;
