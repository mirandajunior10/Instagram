import React from 'react';
import { TextInput, TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native';
import PhotoList from '../Components/PhotoList';
import { f, database } from '../../config/config';
import UserAuth from '../Components/auth';
class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false
        }
    }

    async fetchUserInfo(userID) {
        var that = this;
        try {
            var snapshot = await database.ref('users').child(userID).once('value');
            const exists = snapshot.val() !== null;
            if (exists) user = snapshot.val();
            that.setState({
                username: user.username,
                name: user.name,
                avatar: user.avatar,
                loggedin: true,
                userID: userID
            });
        } catch (error) {
            console.log(error);
        }
    }

    logoutUser() {
        f.auth().signOut();
        alert("Logged out");
    }

    editProfile() {
        this.setState({ editingProfile: true })
        //alert('Edit profile');
    }
    async saveProfile(){
        var name = this.state.name;
        var username = this.state.username;

        if(name !== ''){
            database.ref('users').child(this.state.userID).child('name').set(name);
        }
        if(username !== ''){
            console.log(username)
            database.ref('users').child(this.state.userID).child('username').set(username);
        }

        this.setState({editingProfile: false});
    }

    componentDidMount() {
        var that = this;
        f.auth().onAuthStateChanged(user => {
            if (user) {
                //Logged in
                that.fetchUserInfo(user.uid);
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
                            <Image source={{ uri: this.state.avatar }}
                                style={styles.profileImage} />
                            <View style={styles.profileContent}>
                                <Text>{this.state.name}</Text>
                                <Text>{this.state.username}</Text>
                            </View>
                        </View>
                        {this.state.editingProfile == true ? (
                            <View style={styles.editButtons}>
                                <TouchableOpacity onPress={() => this.setState({ editingProfile: false })}>
                                    <Text style={styles.cancelEdit}>Cancel Editing</Text>
                                </TouchableOpacity>
                                <Text>Name</Text>
                                <TextInput
                                    editable={true}
                                    placeholder={'enter your name'}
                                    onChangeText={text => this.setState({ name: text })}
                                    value={this.state.name}
                                    style={styles.editNameTextInput} />

                                <Text>Username</Text>
                                <TextInput
                                    editable={true}
                                    placeholder={'enter your username'}
                                    onChangeText={text => this.setState({ username: text })}
                                    value={this.state.username}
                                    style={styles.editNameTextInput} />

                                <TouchableOpacity
                                    style={styles.saveEditButton}
                                    onPress={() => this.setState({ editingProfile: false })}>
                                    <Text onPress={() => this.saveProfile()}
                                        style={styles.saveEdit}>Save changes</Text>
                                </TouchableOpacity>

                            </View>
                        ) : (
                                <View style={styles.profileButtons}>
                                    <TouchableOpacity style={styles.button}
                                        onPress={() => this.logoutUser()}>
                                        <Text style={styles.buttonText}>Logout</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => this.editProfile()}
                                        style={styles.button}>
                                        <Text style={styles.buttonText}>Edit profile</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonAddNew}
                                        onPress={() => {
                                            console.log(this.props.navigation.navigate('Upload'));
                                        }}>
                                        <Text style={styles.buttonAddNewText}>Upload new +</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        <PhotoList isUser={true} userID={this.state.userID} navigation={this.props.navigation}></PhotoList>

                    </View>
                ) : (
                       <UserAuth message={'Please login to view your profile'}/>

                    )
                }

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
    editButtons: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20,
        borderBottomWidth: 1,
    },
    cancelEdit: {
        fontWeight: 'bold',
    },
    saveEditButton: {
        backgroundColor: 'blue',
        padding: 10
    },
    saveEdit: {
        color: 'white',
        fontWeight: 'bold'
    },
    editNameTextInput: {
        width: 250,
        marginVertical: 10,
        padding: 5,
        borderColor: 'grey',
        borderWidth: 1
    },
    button: {
        marginTop: 10,
        marginHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 20,
        borderColor: 'grey',
        borderWidth: 1.5
    },
    buttonText: {
        textAlign: 'center',
        color: 'grey'
    },
    buttonAddNew: {
        marginTop: 10,
        marginHorizontal: 40,
        paddingVertical: 35,
        borderRadius: 20,
        borderColor: 'grey',
        borderWidth: 1.5,
        backgroundColor: 'grey',
    },
    buttonAddNewText: {
        textAlign: 'center',
        color: 'white'
    },
    profilePhotos: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green'
    }
});