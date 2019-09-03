import React from 'react';
import { f, auth, database, storage } from '../../config/config';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image } from 'react-native';

class Profile extends React.Component {
    constructor(props) {
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

    render() {
        return (
            <View style={styles.viewOnline}>
                {this.state.loggedin == true ? (
                    //Logged in
                    <View style={styles.viewOnline}>
                        <View style={styles.header}>
                            <Text>Profile</Text>
                        </View>
                        <View style={styles.profile}>
                            <Image source={{ uri: 'https://api.adorable.io/avatars/285/test@user.i.png' }}
                                style={styles.profileImage} />
                            <View style={styles.profileContent}>
                                <Text>Name</Text>
                                <Text>@username</Text>
                            </View>
                        </View>
                        <View style={styles.profileButtons}>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Logout</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Edit profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonAddNew}
                            onPress={() =>{
                                console.log(this.props.navigation.navigate('Upload'));
                            }}>
                                <Text style={styles.buttonAddNewText}>Upload new +</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.profilePhotos}>
                            <Text>Loading photos...</Text>
                        </View>
                    </View>
                ) : (
                        <View style={styles.viewOffline}>
                            <Text>You are not logged in</Text>
                            <Text>Please log in to view your profile.</Text>
                        </View>

                    )}

            </View>);
    }
}

export default Profile;













const styles = StyleSheet.create({
    viewOffline: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewOnline: {
        flex: 1,
    },
    header: {
        height: 70,
        paddingTop: 30,
        backgroundColor: 'white',
        borderColor: 'lightgrey',
        borderBottomWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    profile: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 10,
    },
    profileImage: {
        marginLeft: 10,
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    profileContent: {
        marginRight: 10,
    },
    profileButtons: {
        paddingBottom: 20,
        borderBottomWidth: 1,
    },
    button:{
        marginTop:10,
        marginHorizontal: 40,
        paddingVertical: 15,
        borderRadius:20,
        borderColor:'grey',
        borderWidth: 1.5
    },
    buttonText:{
        textAlign:'center',
        color:'grey'
    },
    buttonAddNew:{
        marginTop:10,
        marginHorizontal: 40,
        paddingVertical: 35,
        borderRadius:20,
        borderColor:'grey',
        borderWidth: 1.5,
        backgroundColor: 'grey',
    },
    buttonAddNewText:{
        textAlign:'center',
        color:'white'
    },
    profilePhotos:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'green'
    }
});