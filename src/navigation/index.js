import React, {useEffect, useCallback, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthNavigator, TabStack} from './routes';
import {createStackNavigator} from '@react-navigation/stack';
import {Platform} from 'react-native';
import {navigationRef} from './RootNavigation';
import {
  createConfig,
  getAccessToken,
  getUserFromIdToken,
  refreshTokens,
} from '@okta/okta-react-native';
import configFile from 'constant/config';
import {useDispatch, useSelector} from 'react-redux';
import {get} from 'lodash';
import Radar from 'react-native-radar';
import {hasRadarPermission, trackOnce} from 'utils/RadarHelper';
import Welcome from 'screens/Welcome';
import {setCurrentLocation, setRadarPermission} from 'screens/Dashboard/thunks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Root = createStackNavigator();

const AppContainer = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const firstLoggedIn = useSelector((state) => state.auth.loggedInCount === 0);
  // const firstLoggedIn = true;

  const dispatch = useDispatch();
  const [token, setToken] = useState(null);

  const configApp = async () => {
    await createConfig({
      // issuer: configFile.issuer,
      clientId: configFile.clientId,
      redirectUri: configFile.redirectUri,
      endSessionRedirectUri: configFile.endSessionRedirectUri,
      discoveryUri: configFile.discoveryUri,
      scopes: configFile.scopes,
      requireHardwareBackedKeyStore: false,
    });
  };

  Radar.on('clientLocation', (result) => {
    console.log('clientLocation:', result);
    dispatch(
      setCurrentLocation({
        latitude: get(result, 'location.latitude'),
        longitude: get(result, 'location.longitude'),
      }),
    );
  });

  Radar.on('location', (result) => {
    // do something with result.location, result.user
  });

  useEffect(() => {
    configApp();
  }, []);

  useEffect(() => {
    setAuth();
  }, [userInfo]);

  const setAuth = useCallback(async () => {
    if (userInfo) {
      const customerId = get(userInfo, 'bookerID');
      if (!customerId) {
        return;
      }

      try {
        const t = await refreshTokens();
        await AsyncStorage.setItem('tokens', JSON.stringify(t));

        const u = await getUserFromIdToken();
        await AsyncStorage.setItem('userClams', JSON.stringify(u));

        setToken(t);
      } catch (e) {
        console.log('Get Access Token Error:', e);
      }
      if (customerId) {
        setRadarConfig(customerId);
      }
    } else {
      setToken(null);
    }
  }, [userInfo]);

  const setRadarConfig = async (customerId) => {
    const status = await hasRadarPermission(customerId);
    dispatch(setRadarPermission(status));
  };

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
