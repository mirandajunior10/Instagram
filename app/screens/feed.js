import React from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { f, auth, database, storage } from '../../config/config';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from "date-fns/locale"
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
        //define o state pra refresh: true e esvazia o vetor photo_feed
        this.setState({
            refresh: true,
            photo_feed: []
        });
        //guarda o escopo da função, para atualizar o state mais tarde
        var that = this;

        try {
            //snapshot guarda a informação requisitada pelo banco de dados (todas as fotos do storage, nesse caso)
            const snapshot = await database.ref('photos').orderByChild('posted').once('value');
            const exists = (snapshot.val() != null);
            if (exists) data = snapshot.val();
            else console.log("Sem retorno");
            //console.log(data);

            //atualiza o state usando a variável that
            var photo_feed = that.state.photo_feed;

            //photo aqui não é o indice, como data é um array de objeto, a variável photo guarda o nome do objeto em cada índice
            for (var photo in data) {
                //mostra no console as informações de cada objeto --Dev only :)
                console.log(photo);
                //guarda em photoObj, o objeto com o nome da variável photo no array data
                var photoObj = data[photo];

                //depois de obtida a foto, o próximo try é feito para buscar as informações do usuário que o app mostrará na tela
                try {
                    const snapshot = await database.ref('users').child(photoObj.author).once('value');
                    const exists = (snapshot.val() != null);
                    if (exists) data = snapshot.val();
                    //mostra no console as informações de cada objeto --Dev only :)
                    console.log(photo);

                    photo_feed.push({
                        id: photo,
                        url: photoObj.url,
                        caption: photoObj.caption,
                        posted: formatDistanceToNow(new Date(photoObj.posted * 1000), {
                            includeSeconds: true,
                            //locale: ptBR,
                            addSuffix: true
                        }),
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
                                        <Text>{item.posted}</Text>
                                        <Text>{item.author}</Text>
                                    </View>
                                    <View>
                                        <Image source={{ uri: item.url }}
                                            style={styles.image} />
                                    </View>
                                    <View style={styles.caption_comment}>
                                        <Text>{item.capt}</Text>
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
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});