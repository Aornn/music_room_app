/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, View, Text } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Player from './Components/Player'
import Navigation from './Navigation/Navigations'
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#191414',
    accent: '#1DB954',
    text: '#FFFFFF',
    placeholder: '#FFFFFF',
    backdrop: '#FFFFFF'
  }
};
export default class App extends React.Component {
  render() {
    return (
      <>


      <PaperProvider theme={theme}>
      
          <Navigation />
          {/* <Player/> */}
      </PaperProvider>
      </>
    )
  }
}