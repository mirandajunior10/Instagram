import React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image } from 'react-native';
import {database} from '../../config/config';
import { formatDistanceToNow } from 'date-fns';

class PhotoList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            photo_feed: [],
            refresh: false,
            loading: true
        }
    }

    componentDidMount() {
        const { isUser, userID } = this.props;
        if (isUser) {
            //Profile
            //UserID to display info
            this.loadFeed(userID)
        } else {
            this.loadFeed('')
        }
    }
    pluralCheck(s) {
        if (s == 1) {
            return ' ago';
        }
        else return 's ago'
    }

    timeConverter(timestamp) {
        var a = new Date(timestamp * 1000);
        var seconds = Math.floor(new Date() - a / 1000);

        var interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + 'year' + this.pluralCheck(interval)
        }

        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + 'month' + this.pluralCheck(interval)
        }

        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + 'day' + this.pluralCheck(interval)
        }

        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + 'hour' + this.pluralCheck(interval)
        }

        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + 'minute' + this.pluralCheck(interval)
        }
        return seconds + 'minute' + this.pluralCheck(interval)
    }

    async addToFlatList(photo_feed, data, photo) {
        var that = this;
        //mostra no console as informações de cada objeto --Dev only :)

        //guarda em photoObj, o objeto com o nome da variável photo no array data
        var photoObj = data[photo];
        //console.log(photoObj);
        //console.log(photoObj.uri);
        //depois de obtida a foto, o próximo try é feito para buscar as informações do usuário que o app mostrará na tela
        try {
            const snapshot = await database.ref('users').child(photoObj.author).child('username').once('value');
            const exists = (snapshot.val() != null);
            if (exists) data = snapshot.val();
            //mostra no console as informações de cada objeto --Dev only :)
            //console.log(photo);

            photo_feed.push({
                id: photo,
                url: photoObj.uri,
                caption: photoObj.caption,
                posted: formatDistanceToNow(new Date(photoObj.posted * 1000), {
                    includeSeconds: true,
                    //locale: ptBR,
                    addSuffix: true
                }),
                author: data,
                authorID: photoObj.author
            });

            that.setState({
                refresh: false,
                loading: false,
                photo_feed

            });
        } catch (error) {

            console.log(error);
        }
    }

    async loadFeed(userID = '') {
        //define o state pra refresh: true e esvazia o vetor photo_feed
        this.setState({
            refresh: true,
            photo_feed: []
        });
        //guarda o escopo da função, para atualizar o state mais tarde
        var that = this;

        try {
            console.log('Feed');
            var loadRef = database.ref('photos');
            if (userID != '') {
                loadRef = database.ref('users').child(userID).child('photos');
            }
            console.log(loadRef);

            //snapshot guarda a informação requisitada pelo banco de dados (todas as fotos do storage, nesse caso)
            const snapshot = await loadRef.orderByChild('posted').once('value');
            //console.log(snapshot);
            const exists = (snapshot.val() != null);
            if (exists) data = snapshot.val();
            else console.log("Sem retorno");
            //console.log(data);

            //atualiza o state usando a variável that
            var photo_feed = that.state.photo_feed;

            //photo aqui não é o indice, como data é um array de objeto, a variável photo guarda o nome do objeto em cada índice
            for (var photo in data) {
                that.addToFlatList(photo_feed, data, photo)
            }
            console.log(photo_feed);
            console.log(that.state.photo_feed);

        } catch (error) {
            console.log(error);
        }

    }

    loadNew = () => {
        const { isUser, userID } = this.props;
        if (isUser) {
            //Profile
            //UserID to display info
            this.loadFeed(userID)
        } else {
            this.loadFeed('')
        }
    }

    render() {
        return (
            <View style={styles.view}>

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
                                        <Text>{item.posted}</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.navigation.navigate('User', { userID: item.authorID })
                                            }}>
                                            <Text>{item.author}</Text>
                                        </TouchableOpacity>

                                    </View>
                                    <View>
                                        <Image source={{ uri: item.url }}
                                            style={styles.image} />
                                    </View>
                                    <View style={styles.comment_view}>
                                        <Text>{item.caption}</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.navigation.navigate('Comments', { photoID: item.id })
                                            }}>
                                            <Text style={styles.comment_button}>[ View Comments ] </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        />
                    )}


            </View>);
    }

}

export default PhotoList;


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
    comment_view: {
        padding: 5
    },
    comment_button: {
        color: 'blue',
        marginTop: 10,
        textAlign: 'center'
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});