import React, {useEffect, useCallback, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthNavigator, TabStack} from './routes';
import {createStackNavigator} from '@react-navigation/stack';
import {Platform} from 'react-native';
import {navigationRef} from './RootNavigation';

import {createConfig, getAccessToken} from '@okta/okta-react-native';
import configFile from 'constant/config';
import {useSelector} from 'react-redux';

const Root = createStackNavigator();

const AppContainer = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [token, setToken] = useState(null);

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
