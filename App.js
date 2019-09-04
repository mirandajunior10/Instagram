import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import { YellowBox } from 'react-native';
import _ from 'lodash';

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
const AppContainer = createAppContainer(MainStack);
export default class App extends React.Component {

  

  constructor(props) {
    super(props);
    //this.login();
  }

  render() {
    return (
      <AppContainer />
    );
  }
}
