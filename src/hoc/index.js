/* eslint react/prop-types: "off" */

import React from 'react';
import ErrorBoundary from './errorBoundary';
import Store from './store';

export default ({children}) => (
  <ErrorBoundary>
    <Store>{children}</Store>
  </ErrorBoundary>
);
