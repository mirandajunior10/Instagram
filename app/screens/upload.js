import React from 'react';
import {FlatList, StyleSheet, Text, View, Image} from 'react-native';

class Upload extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
        <View style={styles.view}>
            <Text>Upload</Text>
        </View>);
    }
}

export default Upload;

const styles = StyleSheet.create({
    view: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });