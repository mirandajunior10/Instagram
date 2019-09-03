import React from 'react';
import { f, auth, database, storage } from '../../config/config';
import {FlatList, StyleSheet, Text, View, Image} from 'react-native';

class Upload extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loggedin: false
        }
    }

    componentDidMount() {
        var that = this;
        f.auth().onAuthStateChanged(user => {
            if (user) {
                //Logged in
                this.setState({
                    loggedin: true
                });
            } else {
                //not logged ing
                this.setState({
                    loggedin: false
                });
            }
        });
    }

    render(){
        return(
        <View style={styles.view}>
            {this.state.loggedin == true ? (
                    //Logged in
                    <Text>Comments</Text>
                ) : (
                        <View>
                            <Text>You are not logged in</Text>
                            <Text>Please log in to post a comment.</Text>
                        </View>

                    )}

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