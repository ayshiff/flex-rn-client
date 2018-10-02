import React from 'react'
import { createStackNavigator } from 'react-navigation'
import HomeScreen from '../Components/Home/HomeScreen'
import LoginScreen from '../Components/Login/LoginScreen'
import ProfileScreen from '../Components/Profile/ProfileScreen'
import LeaveScreen from '../Components/Leave/LeaveScreen'
import ScanScreen from '../Components/Scan/ScanScreen'

const NavigationApp = createStackNavigator({
  Home: { screen: HomeScreen },
  Login: { screen: LoginScreen },
  Profile: { screen: ProfileScreen },
  Leave: { screen: LeaveScreen },
  Scan: { screen: ScanScreen },
})

export default NavigationApp
