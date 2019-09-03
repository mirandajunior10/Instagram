import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { YellowBox } from 'react-native';
import _ from 'lodash';
import { f, auth, database, storage } from './config/config';

import Feed from './app/screens/Feed';
import Upload from './app/screens/Upload';
import Profile from './app/screens/Profile';
import UserProfile from './app/screens/UserProfile';
import Comments from './app/screens/Comments';


YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

const TabStack = createBottomTabNavigator(
  {
    Feed: { screen: Feed },
    Upload: { screen: Upload },
    Profile: { screen: Profile }
  }
)
const MainStack = createStackNavigator({
  Home: { screen: TabStack },
  User: { screen: UserProfile },
  Comments: { screen: Comments }
}, {
    initialRouteName: 'Home',
    mode: 'modal',
    headerMode: 'none',

  })

export default class App extends React.Component {

  async login() {
    //Force user to login
    try {
      let user = await auth.signInWithEmailAndPassword('test@user.com', 'password');


    } catch (error) {
      console.log(error);
    }
  }

  constructor(props) {
    super(props);
    this.login();
  }

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
