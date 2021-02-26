import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Login from 'screens/Auth/Login';
import Signup from 'screens/Auth/Signup';
import Welcome from 'screens/Auth/Welcome';
import Phone from 'screens/Auth/Phone';
import CreatePassword from 'screens/Auth/CreatePassword';
import CheckEmail from 'screens/Auth/CheckEmail';
import RecoverPassword from 'screens/Auth/RecoverPassword';
import Home from 'screens/Dashboard/Home';
import CustomTabbar from './CustomTabbar';
import MyAccount from 'screens/Dashboard/MyAccount';
import MyAppts from 'screens/Dashboard/MyAppts';
import ApptDetails from 'screens/Dashboard/MyAppts/ApptDetails';
import Booking from 'screens/Dashboard/Booking';
import AccountInfo from 'screens/Dashboard/MyAccount/AccountInfo';
import ChangePassword from 'screens/Dashboard/MyAccount/ChangePassword';
import Favorites from 'screens/Dashboard/MyAccount/Favorites';
import Location from 'screens/Dashboard/Booking/Location';
import Coming from 'screens/Dashboard/Booking/Coming';
import Services from 'screens/Dashboard/Booking/Services';
import Addons from 'screens/Dashboard/Booking/Addons';
import DateTime from 'screens/Dashboard/Booking/DateTime';
import Stylists from 'screens/Dashboard/Booking/Stylists';
import Notes from 'screens/Dashboard/Booking/Notes';
import ApptHold from 'screens/Dashboard/Booking/ApptHold';
import Review from 'screens/Dashboard/Booking/Review';
import Addcc from 'screens/Dashboard/Booking/Addcc';
import Confirmation from 'screens/Dashboard/Booking/Confirmation';
import BarflyMembership from 'screens/Dashboard/MyAccount/BarflyMembership';
import BarflyMembershipEnrollment from 'screens/Dashboard/MyAccount/BarflyMembershipEnrollment';
import BarflyConfirm from 'screens/Dashboard/MyAccount/BarflyConfirm';
import ShopDetail from 'screens/Dashboard/Booking/ShopDetail';
import AccountService from 'screens/Dashboard/MyAccount/AccountService';
import AccountAddon from 'screens/Dashboard/MyAccount/AccountAddon';
import Contactus from 'screens/Dashboard/MyAccount/Contactus';
import Events from 'screens/Dashboard/MyAccount/Events';
import PrivacyPolicy from 'screens/Dashboard/MyAccount/PrivacyPolicy';
import TermsOfServices from 'screens/Dashboard/MyAccount/TermsOfServices';
import CaliforniaResidents from 'screens/Dashboard/MyAccount/CaliforniaResidents';
import AccessibilityPolicy from 'screens/Dashboard/MyAccount/AccessibilityPolicy';
import ExtensionPolicy from 'screens/Dashboard/MyAccount/ExtensionPolicy';
import AccountStyle from 'screens/Dashboard/MyAccount/AccountStyle';
import FindLocation from 'screens/Dashboard/MyAccount/FindLocation';
import BookingForm from 'screens/Dashboard/Booking/BookingForm';

const AuthStack = createStackNavigator();
const AppointStack = createStackNavigator();
const AccountStack = createStackNavigator();
const BookStack = createStackNavigator();
const FindLocationStack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const AuthNavigator = () => (
  <AuthStack.Navigator initialRouteName="Welcome" headerMode="none">
    <AuthStack.Screen name="Welcome" component={Welcome} />
    <AuthStack.Screen name="Login" component={Login} />
    <AuthStack.Screen name="Signup" component={Signup} />
    <AuthStack.Screen name="Phone" component={Phone} />
    <AuthStack.Screen name="CreatePassword" component={CreatePassword} />
    <AuthStack.Screen
      name="CheckEmail"
      component={CheckEmail}
      options={{gestureEnabled: false}}
    />
    <AuthStack.Screen name="RecoverPassword" component={RecoverPassword} />
  </AuthStack.Navigator>
);

const AppointNavigator = () => (
  <AppointStack.Navigator headerMode="none">
    <AppointStack.Screen name="MyAppts" component={MyAppts} />
    <AppointStack.Screen name="ApptDetails" component={ApptDetails} />
  </AppointStack.Navigator>
);

const FindLocationNavigator = () => (
  <FindLocationStack.Navigator headerMode="none">
    <FindLocationStack.Screen name="FindLocation" component={FindLocation} />
    <FindLocationStack.Screen name="ShopDetail" component={ShopDetail} />
  </FindLocationStack.Navigator>
);

const AccountNavigator = () => (
  <AccountStack.Navigator headerMode="none">
    <AccountStack.Screen name="MyAccount" component={MyAccount} />
    <AccountStack.Screen name="AccountInfo" component={AccountInfo} />
    <AccountStack.Screen name="ChangePassword" component={ChangePassword} />
    <AccountStack.Screen
      name="FindLocation"
      component={FindLocationNavigator}
    />
    <AccountStack.Screen name="Favorites" component={Favorites} />
    <AccountStack.Screen name="BarflyMembership" component={BarflyMembership} />
    <AccountStack.Screen
      name="BarflyMembershipEnrollment"
      component={BarflyMembershipEnrollment}
    />
    <AccountStack.Screen name="BarflyConfirm" component={BarflyConfirm} />
    <AccountStack.Screen name="AccountService" component={AccountService} />
    <AccountStack.Screen name="AccountAddon" component={AccountAddon} />
    <AccountStack.Screen name="Contactus" component={Contactus} />
    <AccountStack.Screen name="Events" component={Events} />
    <AccountStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
    <AccountStack.Screen name="TermsOfServices" component={TermsOfServices} />
    <AccountStack.Screen name="ExtensionPolicy" component={ExtensionPolicy} />
    <AccountStack.Screen
      name="CaliforniaResidents"
      component={CaliforniaResidents}
    />
    <AccountStack.Screen
      name="AccessibilityPolicy"
      component={AccessibilityPolicy}
    />
    <AccountStack.Screen name="AccountStyle" component={AccountStyle} />
  </AccountStack.Navigator>
);

const BookingNavigator = () => (
  <BookStack.Navigator headerMode="none">
    <BookStack.Screen name="Location" component={Location} />
    <BookStack.Screen name="ShopDetail" component={ShopDetail} />
    <BookStack.Screen name="Coming" component={Coming} />
    <BookStack.Screen name="BookingForm" component={BookingForm} />
    <BookStack.Screen name="Services" component={Services} />
    <BookStack.Screen name="Addons" component={Addons} />
    <BookStack.Screen name="DateTime" component={DateTime} />
    <BookStack.Screen name="Stylists" component={Stylists} />
    <BookStack.Screen name="Notes" component={Notes} />
    <BookStack.Screen name="ApptHold" component={ApptHold} />
    <BookStack.Screen name="Review" component={Review} />
    <BookStack.Screen name="Addcc" component={Addcc} />
    <BookStack.Screen name="Confirmation" component={Confirmation} />
  </BookStack.Navigator>
);

export const TabStack = () => (
  <Tab.Navigator tabBar={(props) => <CustomTabbar {...props} />}>
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Book" component={BookingNavigator} />
    <Tab.Screen name="My Appts" component={AppointNavigator} />
    <Tab.Screen name="Account" component={AccountNavigator} />
  </Tab.Navigator>
);
