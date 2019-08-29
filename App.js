import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import Feed from './app/screens/feed'
import Profile from './app/screens/profile'
import Upload from './app/screens/upload'

const MainStack = createBottomTabNavigator(
  {
    Feed: { screen: Feed },
    Upload: { screen: Upload },
    Profile: { screen: Profile }
  }
)

export default class App extends React.Component {

  render() {
    return (
      <MainStack />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
