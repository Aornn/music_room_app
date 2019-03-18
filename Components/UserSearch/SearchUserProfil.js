import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator, FlatList, TouchableOpacity, Button } from 'react-native'
import { getUserByUid } from '../../API/getUserByUid'
import { getAllUserPlaylist } from '../../API/getAllPlaylistGivenUid'
import { Appbar } from 'react-native-paper';
import firebase from 'react-native-firebase';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            user_search: {},
            query: '',
            res_user: [],
            is_load: true,
            is_friend: false,
            uid: '',
            user_playlist: []
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
    _displayPref() {
        if (this.state.user_search.pref_music !== undefined) {
            return this.state.user_search.pref_music.map((elem, i) => {
                return (
                    <Text style={{ color: "#FFFFFF", padding: 10, fontSize: 18 }} key={i}>{elem}</Text>
                )
            })
        }
    }

    _deleteFriends() {
        firebase.firestore().collection('users').doc(this.state.uid).update({
            friends: firebase.firestore.FieldValue.arrayRemove(this.props.navigation.state.params.id)
        })
        this.setState({ is_friend: false })

    }

    _addFriends() {
        firebase.firestore().collection('users').doc(this.state.uid).update({
            friends: firebase.firestore.FieldValue.arrayUnion(this.props.navigation.state.params.id)
        })
        this.setState({ is_friend: true })
    }

    _manageFriend() {
        if (this.state.is_friend) {
            return (
                <TouchableOpacity onPress={(() => this._deleteFriends())}>
                    <Text style={{ fontSize: 25, color: '#FFFFFF', padding: 10, fontWeight: 'bold', textAlign: 'center' }}>
                        Supprimer de mes amis
                    </Text>
                </TouchableOpacity>
            )
        }
        else {
            return (
                <TouchableOpacity onPress={(() => this._addFriends())}>
                    <Text style={{ fontSize: 25, color: '#FFFFFF', padding: 10, fontWeight: 'bold', textAlign: 'center' }}>
                        Ajouter en ami
                    </Text>
                </TouchableOpacity>
            )
        }
    }
    _displayPlaylist() {
        return (
            <FlatList
                data={this.state.user_playlist}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) =>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgb(18,18,18)', padding: 5, marginBottom: 5 }} onPress={() => {
                        this.props.navigation.navigate('PlaylistDetailSearchUser', { id: item.id })
                    }}>
                        <Text style={{ color: '#FFFFFF', fontSize: 20, marginLeft: 5 }}>{item.Name}</Text>
                        <Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 10 }}>Par {item.creator_name} • {item.titles.length} titres</Text>
                    </TouchableOpacity>}
                refreshing={this.state.refresh}
                onRefresh={this._Onref}
            />
        )
    }
    async componentDidMount() {
        var user = firebase.auth().currentUser ? firebase.auth().currentUser : null //var user = firebase.auth().currentUser
        if (user === null) {
            this.props.navigation.navigate('Signup')
        }
        let targetUid = this.props.navigation.state.params.id
        const currentUser = await getUserByUid(user, user._user.uid)
        const data = await getUserByUid(user, targetUid)
        const UserPlaylist = await getAllUserPlaylist(user, targetUid)
        if (currentUser.friends.includes(targetUid)) {
            this.setState({ is_load: false, user: user, user_search: data, user_playlist: UserPlaylist, is_friend: true, uid: user._user.uid })
        }
        else {
            this.setState({ is_load: false, user: user, user_search: data, user_playlist: UserPlaylist, uid: user._user.uid })
        }
    }
    render() {
        return (
            <SafeAreaView style={styles.main_container}>
                {this._displayLoading()}
                <Appbar.Header>
                    <Appbar.BackAction
                        onPress={() => this.props.navigation.goBack()}
                    />
                    <Appbar.Content
                        title={this.state.user_search.displayName}
                    />

                </Appbar.Header>
                {this._manageFriend()}
                <Text style={{ color: '#FFFFFF', fontSize: 20, padding: 5 }}>
                    Cet utilisateur aime particulierement :
                </Text>
                <View style={{ flexDirection: 'row' }}>
                    {this._displayPref()}
                </View>
                <Text style={{ color: '#FFFFFF', fontSize: 20, padding: 5 }}>Voici ses playlist : </Text>
                {this._displayPlaylist()}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#191414',

    },
    loading_container: {
        position: 'absolute',
        backgroundColor: '#000000',
        zIndex : 1,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})


export default Search