import React, {useState, useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {AuthNavigator, TabStack} from './routes';
import {createStackNavigator} from '@react-navigation/stack';
import {navigationRef} from './RootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Root = createStackNavigator();

const AppContainer = () => {
  const token = useSelector(state => state.auth.token)
  // const [token, setToken] = useState(null);

  const getToken = useCallback(async () => {
    console.log(token)
    if (token) {
      await AsyncStorage.setItem('token', JSON.stringify(token))
    }
  }, [token])

  useEffect(() => {
    getToken()
  }, [])
  
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
