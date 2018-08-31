import React from 'react';
import { createStackNavigator } from 'react-navigation';
import HomeScreen from '../Components/HomeScreen';
import LoginScreen from '../Components/LoginScreen';
import ProfileScreen from '../Components/ProfileScreen';
import LeaveScreen from '../Components/LeaveScreen';
import ScanScreen from '../Components/ScanScreen';

const NavigationApp = createStackNavigator ({
  Home: { screen: HomeScreen },
  Login: { screen: LoginScreen },
  Profile: { screen: ProfileScreen },
  Leave: { screen: LeaveScreen },
  Scan: { screen: ScanScreen },
});

export default NavigationApp;
