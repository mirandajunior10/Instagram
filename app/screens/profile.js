import React from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';

class Profile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <View style={styles.view}>
            <Text>Profile</Text>
        </View>);
    }
}

export default Profile;

const styles = StyleSheet.create({
    view: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });