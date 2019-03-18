import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native'
import { getAllPublicPlaylist } from '../../API/getAllPublicPlaylist'
import firebase from 'react-native-firebase';
import { Appbar } from 'react-native-paper';

class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this._isMount = false,
            this.state = {
                user: {},
                token: '',
                playlist: [],
                refresh: false,
                is_load: false,
            }

    }
    _Onref = async () => {
        this.setState({ refresh: true, is_load: true })
        var user = firebase.auth().currentUser ? firebase.auth().currentUser : null //var user = firebase.auth().currentUser
        if (user === null) {
            this.props.navigation.navigate('Signup')
        }
        getAllPublicPlaylist(user).then((p) => {
            if (this._isMount === true) {
                this.setState({ user, playlist: p, refresh: false, is_load: false })
            }
        })
            .catch(() => {
                this._isMount = false
            })
    }

    _displayPlaylist() {
        return (
            <FlatList
                data={this.state.playlist}
                extraData={this.state}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) =>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgb(18,18,18)', padding: 5, marginBottom: 5 }} onPress={() => {
                        this.props.navigation.navigate('PlaylistDetail', { id: item.id })
                    }}>
                        <Text style={{ color: '#FFFFFF', fontSize: 20, marginLeft: 5 }}>{item.Name}</Text>
                        <Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 10 }}>Par {item.creator_name} • {item.titles.length} titres</Text>
                    </TouchableOpacity>}
                refreshing={this.state.refresh}
                onRefresh={this._Onref}
            />
        )
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
    componentWillUnmount() {
        this._isMount = false
    }

    async componentDidMount() {
        this._isMount = true
        this.setState({ is_load: true })
        var user = firebase.auth().currentUser ? firebase.auth().currentUser : null //var user = firebase.auth().currentUser
        if (user === null) {
            this.props.navigation.navigate('Signup')
        }
        getAllPublicPlaylist(user)
            .then((p) => {
                if (this._isMount === true) {
                    console.log('if playlist')
                    this.setState({ user, playlist: p, is_load: false })
                }
            })
            .catch(() => {
                this._isMount = false
                console.log('catch')
            })
    }
    render() {
        return (
            <SafeAreaView style={styles.main_container}>
                <Appbar.Header>
                    <Appbar.Content
                        title="Playlist Publique"
                    />
                </Appbar.Header>
                {this._displayPlaylist()}
                {this._displayLoading()}
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
        zIndex: 1,
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


export default Playlist