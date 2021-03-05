import React, {useEffect, useCallback, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthNavigator, TabStack} from './routes';
import {createStackNavigator} from '@react-navigation/stack';
import {Platform} from 'react-native';
import {navigationRef} from './RootNavigation';
import {createConfig, getAccessToken} from '@okta/okta-react-native';
import configFile from 'constant/config';
import {useSelector} from 'react-redux';
import {get} from 'lodash';
import Radar from 'react-native-radar';
import {hasRadarPermission} from 'utils/RadarHelper';
import Welcome from 'screens/Welcome';

const Root = createStackNavigator();

const AppContainer = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const firstLoggedIn = useSelector((state) => state.auth.loggedInCount === 0);
  const [token, setToken] = useState(null);

  const customerId = get(userInfo, 'bookerID');
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

  Radar.on('clientLocation', (result) => {
    // do something with result.location
    console.log('Radar clientLocation:', result);
  });

  Radar.on('location', (result) => {
    // do something with result.location, result.user
    console.log('radar clientLocation:', result);
  });

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
      if (customerId) {
        hasRadarPermission(customerId);
      }
    } else {
      setToken(null);
    }
  }, [userInfo, customerId]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Root.Navigator headerMode="none">
        {token ? (
          firstLoggedIn ? (
            <Root.Screen name="Welcome" component={Welcome} />
          ) : (
            <Root.Screen name="Dashboard" component={TabStack} />
          )
        ) : (
          <Root.Screen name="Auth" component={AuthNavigator} />
        )}
      </Root.Navigator>
    </NavigationContainer>
  );
};

export default AppContainer;
