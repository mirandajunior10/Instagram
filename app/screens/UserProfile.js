import React from 'react';
import { f, auth, database, storage } from '../../config/config';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image } from 'react-native';
import PhotoList from '../Components/PhotoList';
class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        }
    }
    checkParams() {
        //
        var params = this.props.navigation.state.params;
        if (params) {
            if (params.userID) {
                this.setState({
                    userID: params.userID
                })
                this.fetchUserInfo(params.userID);
            }
        }
    }

    async fetchUserInfo(userID) {
        var that = this;
        try {
            var snapshot = await database.ref('users').child(userID).child('username').once('value');
            const exists = snapshot.val() !== null;
            if (exists) username = snapshot.val();
            that.setState({ username });
        } catch (error) {
            console.log(error);
        }
        try {
            var snapshot = await database.ref('users').child(userID).child('name').once('value');
            const exists = snapshot.val() !== null;
            if (exists) name = snapshot.val();
            that.setState({ name });
        } catch (error) {
            console.log(error);
        }
        try {
            var snapshot = await database.ref('users').child(userID).child('avatar').once('value');
            const exists = snapshot.val() !== null;
            if (exists) avatar = snapshot.val();
            that.setState({ avatar, loaded: true });
        } catch (error) {
            console.log(error);
            that.setState({ loaded: true });
        }
    }
    componentDidMount() {
        this.checkParams();

    }

    render() {
        return (
            <View style={styles.viewOnline}>
                {this.state.loaded == false ? (
                    <View style={styles.viewOffline}>
                        <Text>Loading...</Text>
                    </View>
                ) : (
                        <View style={styles.viewOnline}>
                            <View style={styles.header}>
                                <TouchableOpacity
                                    style={styles.headerItems}
                                    onPress={() => this.props.navigation.goBack()}>
                                    <Text style={styles.goBack}>Go back</Text>
                                </TouchableOpacity>
                                <Text>Profile</Text>
                                <Text style={styles.headerItems}></Text>
                            </View>
                            <View style={styles.profile}>
                                <Image source={{ uri: this.state.avatar }}
                                    style={styles.profileImage} />
                                <View style={styles.profileContent}>
                                    <Text>{this.state.name}</Text>
                                    <Text>{this.state.username}</Text>
                                </View>
                            </View>
                            <PhotoList isUser={true} userID={this.state.userID} navigation={this.props.navigation}></PhotoList>

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
        flexDirection: 'row',
        height: 70,
        paddingTop: 30,
        backgroundColor: 'white',
        borderColor: 'lightgrey',
        borderBottomWidth: 0.5,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerItems: {
        width: 100,
    },
    goBack: {
        fontSize: 12,
        fontWeight: 'bold',
        paddingLeft: 10
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