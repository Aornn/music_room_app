import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native'
import { Appbar, Searchbar } from 'react-native-paper';
import SoundPlayer from 'react-native-sound-player'
import axios from 'axios'
import firebase from 'react-native-firebase';

class AddPlaylist extends React.Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('playlist')
        this.state = {
            playlist: [],
            is_load: true,
            uid: '',
        }

    }
    _displayLoading() {
        if (this.state.is_load) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
    }
    _addPlaylist(id) {
        console.log(id)
        const song = this.props.navigation.state.params.song
        this.ref.doc(id).update({
            titles: firebase.firestore.FieldValue.arrayUnion(
                {
                    ...song,
                    in_Playlist: true,
                }
            )
        }).then(() => {
            this.props.navigation.goBack()
        })
    }
    async componentDidMount() {
        var user = firebase.auth().currentUser
        if (user === null) {
            this.props.navigation.navigate('Signup')
        }
        let playlist = []
        const res = await this.ref.where('follower', 'array-contains', user._user.uid).get()
        res.forEach(elem => {
            playlist.push({
                id: elem.id,
                Name: elem.data().Name,
                creator_name: elem.data().creator_name,
                nb_titles: elem.data().titles.length,
            })
        });
        this.setState({ playlist, uid: user._user.uid, is_load: false })
    }
    render() {
        return (
            <SafeAreaView style={styles.main_container}>
                <Appbar.Header style={{ marginBottom: 5 }}>
                    <Appbar.BackAction
                        onPress={() => this.props.navigation.goBack()}
                    />
                </Appbar.Header>
                <FlatList
                    data={this.state.playlist}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) =>
                        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgb(18,18,18)', padding: 5, marginBottom: 5 }} onPress={() => this._addPlaylist(item.id)}>
                            <Text style={{ color: '#FFFFFF', fontSize: 20, marginLeft: 5 }}>{item.Name}</Text>
                            <Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 10 }}>Par {item.creator_name} • {item.nb_titles} titres</Text>
                        </TouchableOpacity>}
                />
                {this._displayLoading()}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        color: '#FFFFFF',
        backgroundColor: '#000000',
    },
    loading_container: {
        position: 'absolute',
        backgroundColor: '#191414',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})


export default AddPlaylist