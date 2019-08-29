import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import Feed from './app/screens/feed'
import Profile from './app/screens/profile'
import Upload from './app/screens/upload'
import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

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
