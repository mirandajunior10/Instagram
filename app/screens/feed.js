import React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View} from 'react-native';

import PhotoList from '../Components/PhotoList';

class Feed extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <View style={styles.view}>
                <View style={styles.header}>
                    <Text>Feed</Text>
                </View>

                <PhotoList isUser={false} navigation={this.props.navigation} />


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
    }
});