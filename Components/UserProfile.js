import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator, Alert, TouchableOpacity, FlatList } from 'react-native'
import firebase from 'react-native-firebase';
import { deleteMe } from './User_actions/DeleteMe'
import { getUserPlaylist } from '../API/getUserPlaylist'
import { List, Appbar, Searchbar } from 'react-native-paper';

class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            is_load: false,
            playlist: [],
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
    _NavToPlaylistdetail(id) {
        this.props.navigation.navigate('PlaylistDetail', { id })
    }
    _displayPlaylist() {
        if (this.state.playlist.length > 0) {
            return (
                <FlatList
                    data={this.state.playlist}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <List.Item
                        title={item.Name}
                        description={item.genre}
                        left={props => <List.Icon {...props} icon="library-music" />}
                        onPress={() => { this._NavToPlaylistdetail(item.id) }}
                    />}

                />
            )
        }
    }
    // A garder au cas ou
    // async _getP(user) {
    //     var token = await user.getIdToken()
    //     let config = {
    //         headers: {
    //             'Authorization': 'Bearer ' + token
    //         }
    //     }
    //     return axios.get('https://us-central1-music-room-42.cloudfunctions.net/getAllCurrentUserPlaylist', config)
    //         .then((res) => {
    //             return res.data
    //         })
    // }

    componentDidMount() {
        console.log('in')
        this.setState({ is_load: true })
        var user = firebase.auth().currentUser
        if (user === null) {
            this.props.navigation.navigate('Signup')
        }
        getUserPlaylist(user).then((p) => {
            this.setState({ user, playlist: p, is_load: false })
        })

    }
    componentDidUpdate() {
        if (this.props.navigation.state.params !== undefined && this.props.navigation.state.params.change > 0) {
            if (this.props.navigation.state.params.change == 2) {
                this.props.navigation.state.params.change = 0
                firebase.auth().signOut().then(() => {
                    this.props.navigation.navigate('Loading')
                })
            }
            else {
                this.props.navigation.state.params.change = 0
                var new_user = firebase.auth().currentUser
                getUserPlaylist(new_user).then((p) => {
                    this.setState({ new_user, playlist: p, is_load: false })
                })
            }
        }

    }
    render() {
        return (

            <SafeAreaView style={styles.main_container}>
                <Appbar.Header>
                    <Appbar.Action icon="more-vert" onPress={(() => {
                    })} />
                    <Appbar.Content
                        title="Music Room 42"
                    />
                </Appbar.Header>

                <Text>Hello {this.state.user.displayName} voici vos playlist : </Text>
                {this._displayPlaylist()}
                <View style={styles.manage}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            firebase.auth().signOut().then(() => {
                                this.props.navigation.navigate('Login')
                            })
                        }}
                        underlayColor='#fff'>
                        <Text style={styles.txt_btn}>Déconnexion</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => deleteMe(this.state.user)}
                        underlayColor='#fff'>
                        <Text style={styles.txt_btn}>Supprimer son compte</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('UserInfo', { user: this.state.user })}
                    underlayColor='#fff'>
                    <Text style={styles.txt_btn}>Détail du compte</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('CreatePlaylist', { user: this.state.user })}
                    underlayColor='#fff'>
                    <Text style={styles.txt_btn}>Créer playlist</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Search', { user: this.state.user })}
                    underlayColor='#fff'>
                    <Text style={styles.txt_btn}>Chercher musiques</Text>
                </TouchableOpacity>
                {this._displayLoading()}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        // marginTop: 20,
    },
    manage: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    loading_container: {
        position: 'absolute',
        backgroundColor: '#FFFFFF',
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


export default UserProfile