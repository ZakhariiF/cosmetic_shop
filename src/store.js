/*
 * @file: store.js
 * @description: Configure/creating redux store with thunk,reducer etc
 * @date: 11.03.2020
 * @author: Dalbeer Sandhu
 * */

import {createStore, applyMiddleware, compose} from 'redux';
import thunks from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
import reducers from './reducers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
};

const reducer = persistReducer(authConfig, reducers);
const middleware = [thunks];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  compose(composeEnhancers(applyMiddleware(...middleware))),
);

const persistor = persistStore(store);

export {store as default, persistor};
