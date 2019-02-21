import React from 'react'
import { SafeAreaView, View, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Text } from 'react-native'
import firebase from 'react-native-firebase';
import { getUserPlaylist } from '../../API/getUserPlaylist'
import { List, Appbar } from 'react-native-paper';

class UserPlaylist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            is_load: false,
            playlist: [],
            refresh: false,
        }

    }
    _Onref = () => {
        this.setState({ refresh: true })
        var user = firebase.auth().currentUser
        if (user === null) {
            this.props.navigation.navigate('Signup')
        }
        getUserPlaylist(user).then((p) => {
            this.setState({ user, playlist: p, refresh: false })
        })
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
    _NavToPlaylistdetail(id) {
        this.props.navigation.navigate('PlaylistDetailUser', { id })
    }
    _displayPlaylist() {
        if (this.state.playlist.length > 0) {
            return (
                <FlatList
                    data={this.state.playlist}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) =>


                        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgb(18,18,18)', padding: 5, marginBottom: 5 }} onPress={() => this._NavToPlaylistdetail(item.id)}>
                            <Text style={{ color: '#FFFFFF', fontSize: 20, marginLeft: 5 }}>{item.Name}</Text>
                            <Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 10 }}>Par {item.creator_name} • {item.titles.length} titres</Text>
                        </TouchableOpacity>
                    }
                    refreshing={this.state.refresh}
                    onRefresh={this._Onref}
                />
            )
        }
        else {
            return (
                <Text style={{ color: 'white' }}>Oups pas de playlist</Text>
            )
        }
    }
    componentDidMount() {
        console.log('UserPlaylist is mounted')
        this.setState({ is_load: true })
        var user = firebase.auth().currentUser
        if (user === null) {
            this.props.navigation.navigate('Signup')
        }
        getUserPlaylist(user).then((p) => {
            this.setState({ user, playlist: p, is_load: false })
        })

    }
    render() {
        return (

            <SafeAreaView style={styles.main_container}>
                <Appbar.Header>
                    <Appbar.Content
                        title="Playlist Privée"
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
        // marginTop: 20,
    },
    manage: {
        alignItems: 'center',
        flexDirection: 'row',
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
    },
    txt_btn: {
        color: "rgb(55,128,243)",
        textAlign: 'center',
        fontSize: 18
    },
    button: {
        height: 50,
        width: 200,
        paddingTop: 10,
        marginRight: 2,
        marginLeft: 2,
        marginTop: 20,
        borderRadius: 5,
    }
})


export default UserPlaylist