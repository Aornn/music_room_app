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
    _displayTaste() {
        if (this.state.user_search.length > 0) {
            return this.state.user_search.map((elem, i) => {
                return (
                    <Text style={{ color: "#FFFFFF" }}>{elem}</Text>
                )
            })
        }

    }

    _deleteFriends()
    {
        firebase.firestore().collection('users').doc(this.state.uid).update({
            friends : firebase.firestore.FieldValue.arrayRemove(this.props.navigation.state.params.id)
        })
        this.setState({is_friend : false})

    }

    _addFriends()
    {
        firebase.firestore().collection('users').doc(this.state.uid).update({
            friends : firebase.firestore.FieldValue.arrayUnion(this.props.navigation.state.params.id)
        })
        this.setState({is_friend : true})
    }

    _manageFriend() {
        if (this.state.is_friend) {
            return (
                <Button
                    onPress={(()=>this._deleteFriends())}
                    title="Supprimer de ma liste d'ami"
                    color="rgb(25,20,20)"
                    accessibilityLabel="Supprimer de ma liste d'ami"
                />
            )
        }
        else {
            return (
                <Button
                onPress={(()=>this._addFriends())}
                title="Ajouter dans ma liste d'ami"
                    color="rgb(25,20,20)"
                    accessibilityLabel="Ajouter dans ma liste d'ami"
                />
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
        var user = firebase.auth().currentUser
        if (user === null) {
            this.props.navigation.navigate('Signup')
        }
        let targetUid = this.props.navigation.state.params.id
        const currentUser =  await getUserByUid(user, user._user.uid)
        const data = await getUserByUid(user, targetUid)
        const UserPlaylist = await getAllUserPlaylist(user, targetUid)
        console.log(currentUser)
        if (currentUser.friends.includes(targetUid)) {
            this.setState({ is_load: false, user: user, user_search: data, user_playlist: UserPlaylist, is_friend: true, uid : user._user.uid })
        }
        else {
            this.setState({ is_load: false, user: user, user_search: data, user_playlist: UserPlaylist, uid : user._user.uid })
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
                {this._displayTaste()}
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
        backgroundColor: '#191414',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})


export default Search