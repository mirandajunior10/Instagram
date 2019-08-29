import React from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { f, auth, database, storage } from '../../config/config';

class Feed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photo_feed: [],
            refresh: false,
            loading: true
        }
    }

    componentDidMount() {
        //Load Feed
        this.loadFeed();
    }

    async loadFeed() {

        this.setState({
            refresh: true,
            photo_feed: []
        });

        var that = this;

        try {
            const snapshot = await database.ref('photos').orderByChild('posted').once('value');
            const exists = (snapshot.val() != null);
            if (exists) data = snapshot.val();

            var photo_feed = that.state.photo_feed;

            for (var photo in data) {
                var photoObj = data[photo];
                try {
                    const snapshot = await database.ref('users').child(photoObj.author).once('value');
                    const exists = (snapshot.val() != null);
                    if (exists) data = snapshot.val();

                    photo_feed.push({
                        id: photo,
                        url: photoObj.url,
                        caption: photoObj.caption,
                        posted: photoObj.posted,
                        author: data.username
                    });

                    that.setState({
                        refresh: false,
                        loading: false,

                    });
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error);
        }

    }

    loadNew = () => {
        this.loadFeed();
    }

    render() {
        return (
            <View style={styles.view}>
                <View style={styles.header}>
                    <Text>Feed</Text>
                </View>

                {this.state.loading == true ? (
                    <View style={styles.loading}>
                        <Text>Loading</Text>
                    </View>
                ) : (
                        <FlatList
                            refreshing={this.state.refresh}
                            onRefresh={this.loadNew}
                            data={this.state.photo_feed}
                            keyExtractor={(item, index) => index.toString()}
                            style={styles.FlatList}
                            renderItem={({ item, index }) => (
                                <View key={index} style={styles.post}>
                                    <View style={styles.post_header}>
                                        <Text>Time ago</Text>
                                        <Text>@Rusty</Text>
                                    </View>
                                    <View>
                                        <Image source={{ uri: item.url }}
                                            style={styles.image} />
                                    </View>
                                    <View style={styles.caption_comment}>
                                        <Text>Caption teste here</Text>
                                        <Text style={styles.comment}>View Comments</Text>
                                    </View>
                                </View>
                            )}
                        />
                    )}


            </View>);
    }
}

export default Feed;














const styles = StyleSheet.create({
    view: {
        flex: 1
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
    image: {
        resizeMode: 'cover',
        width: '100%',
        height: 275
    },
    FlatList: {
        flex: 1,
        backgroundColor: '#eee'
    },
    post: {
        width: '100%',
        overflow: 'hidden',
        marginBottom: 5,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: 'grey'
    },
    post_header: {
        padding: 5,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    caption_comment: {
        padding: 5
    },
    comment: {
        marginTop: 10,
        textAlign: 'center'
    },
    loading:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});