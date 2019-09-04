import React from 'react';
import { f, database } from '../../config/config';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView , TextInput} from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import UserAuth from '../Components/auth'

class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,
            comments_list: []
        }
    }

    async addCommentToList(comments_list, data, comment) {
        //console.log(comments_list, data, comment);
        var that = this;
        var commentObj = data[comment];
        try {
            var snapshot = await database.ref('users').child(commentObj.author).child('username').once('value');
            const exists = (snapshot.val() !== null);
            if (exists) data = snapshot.val();
            //console.log(data);
            comments_list.push({
                id: comment,
                comment: commentObj.comment,
                posted: formatDistanceToNow(new Date(commentObj.posted * 1000), {
                    includeSeconds: true,
                    //locale: ptBR,
                    addSuffix: true
                }),
                author: data,
                authorID: commentObj.author
            });
            that.setState({
                refresh: false,
                loading: false
            });
        }
        catch (error) {

        }
    }

    async fetchComments(photoID) {
        //Fetch comments here...
        var that = this;
        try {
            var snapshot = await database.ref('comments').child(photoID).orderByChild('posted').once('value');
            const exists = (snapshot.val() !== null);
            if (exists) {
                //add comments  to flatlist
                data = snapshot.val();
                var comments_list = that.state.comments_list;
                for (var comment in data) {
                    that.addCommentToList(comments_list, data, comment);
                }
            } else {
                //there are no comments_list
                that.setState({
                    comments_list: []
                })
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    checkParams() {
        //
        var params = this.props.navigation.state.params;
        //console.log(params.photoID);
        if (params) {
            if (params.photoID) {
                this.setState({
                    photoID: params.photoID
                })
                this.fetchComments(params.photoID);
            }
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

        this.checkParams();

    }

    S4() {
        return Math.floor(1 + Math.random() * 0x10000).toString(16).substring(1);
    }

    uniqueID() {
        return this.S4() + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' +
            this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4();
    }

    postComment(){
        var comment = this.state.comment;
        if(comment != ''){
            //process
            var imageID = this.state.photoID;
            var userID = f.auth().currentUser.uid;
            var commentID = this.uniqueID();
            var dateTime = Date.now();
            var timestamp = Math.floor(dateTime/ 1000);
            this.setState({
                comment: ''
            });

            var commentObj = {
                posted: timestamp,
                author: userID,
                comment: comment
            };

            database.ref('/comments/' + imageID + '/' + commentID).set(commentObj);

            //reload comments
            this.reloadCommentList();
        }
        else{
            alert('Please enter a comment before posting.')
        }
    }

    reloadCommentList(){
        this.setState({
            comments_list:[]
        });
        this.fetchComments(this.state.photoID);
    }

    render() {
        return (
            <View style={styles.view}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.headerItems}
                        onPress={() => this.props.navigation.goBack()}>
                        <Text style={styles.goBack}>Go back</Text>
                    </TouchableOpacity>
                    <Text>Comments</Text>
                    <Text style={styles.headerItems}></Text>
                </View>
                {this.state.comments_list.length == 0 ? (
                    //no comments
                    <Text>No comments found.</Text>
                ) : (
                        //There are comments
                        <FlatList
                            refreshing={this.state.refresh}
                            data={this.state.comments_list}
                            keyExtractor={(item, index) => index.toString()}
                            style={styles.Flatlist}
                            renderItem={({ item, index }) => (
                                <View key={index} style={styles.comment}>
                                    <View style={styles.comment_header}>
                                        <Text>{item.posted}</Text>
                                        <TouchableOpacity
                                            onPress={() => this.props.navigation.navigate('User', { userID: item.authorID })}>
                                            <Text>{item.author}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.comment_content}>
                                        <Text>{item.comment}</Text>
                                    </View>
                                </View>
                            )}
                        />
                    )}
                {this.state.loggedin == true ? (
                    //Logged in
                    <KeyboardAvoidingView behavior='padding' enabled style={styles.KeyboardAvoidingView}>
                        <Text style={styles.post_comment}>Pots comment</Text>
                        <View>
                            <TextInput
                            editable={true}
                            placeholder={'enter your comment here...'}
                            onChangeText={text => this.setState({comment: text})}
                            value={this.state.comment}
                            style={styles.text_input}/>
                            <TouchableOpacity
                            style={styles.post_button}
                            onPress={() => this.postComment()}>
                                <Text style={styles.post_button_text}>Post</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                    ) : (
                        <UserAuth navigation={this.props.navigation} moveScreen={true} message={'Please log in to post a comment.'}/>


                    )}

            </View>);
    }
}

export default Comments;

const styles = StyleSheet.create({
    view: {
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
    FlatList: {
        flex: 1,
        backgroundColor: '#eee'
    },
    comment: {
        width: '100%',
        overflow: 'hidden',
        marginBottom: 5,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: 'grey'
    },
    comment_header: {
        padding: 5,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    comment_content: {
        padding: 5
    },
    KeyboardAvoidingView:{
        borderTopWidth:1,
        borderTopColor:'grey',
        padding: 10,
        marginBottom: 15
    },
    post_comment:{
        fontWeight: 'bold'
    },
    text_input:{
        marginVertical: 10,
        height:50,
        padding:5,
        borderColor:'grey',
        borderRadius:3,
        backgroundColor:'white',
        color:'black'
    },
    post_button:{
        paddingVertical:10,
        paddingHorizontal:20,
        backgroundColor:'blue',
        borderRadius:5
    },
    post_button_text:{
        color:'white'
    },

});