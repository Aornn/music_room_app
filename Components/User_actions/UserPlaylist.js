import React from 'react'
import { SafeAreaView, View, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Text } from 'react-native'
import firebase from 'react-native-firebase';
import { getUserPlaylist } from '../../API/getUserPlaylist'
import { List, Appbar } from 'react-native-paper';

class UserPlaylist extends React.Component {
    constructor(props) {
        super(props);
        this._isMount = false,
            this.state = {
                user: {},
                is_load: false,
                playlist: [],
                refresh: false,
            }

    }
    _Onref = async () => {
        this.setState({ refresh: true })
        var user = firebase.auth().currentUser ? firebase.auth().currentUser : null //var user = firebase.auth().currentUser
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
        this.props.navigation.navigate('PlaylistDetail', { id })
    }
    _displayPlaylist() {

        return (
            <FlatList
                data={this.state.playlist}
                extraData={this.state}
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
    componentDidUpdate() {
        if (this.props.navigation.state.params !== undefined && this.props.navigation.state.params.need_update == 1) {
            var indexOfPlaylist = this.state.playlist.findIndex(item => item.id === this.props.navigation.state.params.id);
            this.state.playlist.splice(indexOfPlaylist, 1);
            this.setState({ playlist: this.state.playlist })
            this.props.navigation.state.params.need_update = 0
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
        getUserPlaylist(user).then((p) => {
            if (this._isMount === true) {
                this.setState({ user, playlist: p, is_load: false })
            }
        })
            .catch(() => {
                this._isMount = false
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
        zIndex: 1,
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