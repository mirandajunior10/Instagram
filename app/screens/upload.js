import React from 'react';
import { f, database, storage } from '../../config/config';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,
           comments_list:[]
        }
    }

    async checkPermissions() {
        const status = await Permissions.askAsync(Permissions.CAMERA)
        this.setState({ camera: status });

        const statusRoll = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ cameraRoll: statusRoll });
    }

    S4() {
        return Math.floor(1 + Math.random() * 0x10000).toString(16).substring(1);
    }

    uniqueID() {
        return this.S4() + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' +
            this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4();
    }

    async findNewImage() {
        this.checkPermissions();

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'Images',
            allowsEditing: true,
            quality: 1
        });

        console.log(result);
        if (!result.cancelled) {
            console.log('Upload image');
            this.setState({
                imageSelected: true,
                imageID: this.uniqueID(),
                uri: result.uri
            })
        } else {
            console.log('cancelled');
            this.setState({
                imageSelected: false,
            });
        }
    }

    uploadPublish() {
        if (!this.state.uploading) {
            if (this.state.caption != '') {
                this.uploadImage(this.state.uri);
                //this.setState({uploading: false});
            } else {
                alert('please enter a caption...');
            }
        } else {
            console.log('Ignore button tap as already uploading')
        }
    }

    async uploadImage(uri) {
        var that = this;
        var userID = f.auth().currentUser.uid;
        var imageID = this.state.imageID;

        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(uri)[1];
        this.setState({
            currentFileType: ext,
            uploading: true
        });
        const response = await fetch(uri);
        const blob = await response.blob();
        var FilePath = imageID + "." + that.state.currentFileType;

        var uploadTask = storage.ref('user/' + userID + '/img').child(FilePath).put(blob);
        uploadTask.on('state_changed', snapshot => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes * 100).toFixed(0);
            console.log('Uplopad is ' + progress + '% complete');
            that.setState({ progress });

        }, error => {
            console.log('Error with upload -', error);
        }, async () => {
            that.setState({ progress: 100 });
            try {
                const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                console.log(downloadURL);
                that.processUpload(downloadURL);
            } catch (error) {
                console.log(error)
            }

        });


    }

    processUpload(imageURL) {
        //Process here...

        var userID = f.auth().currentUser.uid;
        var date = Date.now();
        var caption = this.state.caption;
        var timestamp = Math.floor(date / 1000);
        var imageID = this.state.imageID;

        //Build photo object
        //author, caption, posted,url

        var photoObj = {
            author: userID,
            caption: caption,
            posted: timestamp,
            uri: imageURL
        };

        //Update database

        //Add to main feed
        database.ref('/photos/' + imageID).set(photoObj);

        //Set user photos object
        var ref = '/users/' + userID + '/photos/' + imageID;
        console.log(ref)
        database.ref('/users/' + userID + '/photos/' + imageID).set(photoObj);

        alert('Image uploaded');
        this.setState({
            uploading: false,
            imageSelected: false,
            caption: '',
            url: '',

        })
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
            <View style={styles.flex1}>
                {this.state.loggedin == true ? (
                    //Logged in
                    <View style={styles.flex1}>

                        {this.state.imageSelected == true ? (
                            //Check if an image is selected
                            <View style={styles.flex1}>
                                <View style={styles.header}>
                                    <Text>Upload</Text>
                                </View>
                                <View style={{ padding: 5 }}>
                                    <Text style={{ marginTop: 5 }}>Caption</Text>
                                    <TextInput
                                        editable={true}
                                        placeholder={'Enter your caption...'}
                                        maxLength={150}
                                        multiline={true}
                                        numberOfLines={4}
                                        onChangeText={text => this.setState({ caption: text })}
                                        style={styles.caption_textInput} />

                                    <TouchableOpacity
                                        style={styles.upload_button}
                                        onPress={() => this.uploadPublish()}>
                                        <Text style={styles.upload_button_text}>Upload & publish</Text>
                                    </TouchableOpacity>
                                    {this.state.uploading == true ? (
                                        <View>
                                            <Text>{this.state.progress}%</Text>
                                            {this.state.progress != 100 ? (
                                                <ActivityIndicator size="small" color="blue" />
                                            ) : (
                                                    <Text>Processing</Text>
                                                )}
                                        </View>
                                    ) : (
                                            <View></View>
                                        )}
                                    <Image source={{ uri: this.state.uri }}
                                        style={styles.imagePreview} />


                                </View>
                            </View>
                        ) : (
                                <View style={styles.upload_view}>
                                    <Text style={styles.upload_text}>Upload</Text>
                                    <TouchableOpacity
                                        style={styles.select_photo_button}
                                        onPress={() => this.findNewImage()}>
                                        <Text style={styles.select_photo_text}>Select Photo</Text>
                                    </TouchableOpacity>

                                </View>
                            )}
                    </View>
                ) : (
                        <View style={styles.logged_out}>
                            <Text>You are not logged in</Text>
                            <Text>Please log in to upload a photo.</Text>
                        </View>

                    )}

            </View>);
    }
}

export default Upload;

const styles = StyleSheet.create({
    header: {
        height: 70,
        paddingTop: 30,
        backgroundColor: 'white',
        borderColor: 'lightgrey',
        borderBottomWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    caption_textInput: {
        marginVertical: 10,
        height: 100,
        padding: 5,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 3,
        backgroundColor: 'white',
        color: 'black'
    },
    logged_out: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flex1: {
        flex: 1,

    },
    upload_view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    upload_text: {
        fontSize: 28,
        paddingBottom: 15
    },
    select_photo_button: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: 'blue',
        borderRadius: 5
    },
    select_photo_text: {
        color: 'white'
    },
    upload_button: {
        alignSelf: 'center',
        width: 170,
        marginHorizontal: 'auto',
        backgroundColor: 'purple',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    upload_button_text: {
        textAlign: 'center',
        color: 'white'
    },
    imagePreview: {
        marginTop: 10,
        resizeMode: 'cover',
        width: '100%',
        height: 275
    }
});