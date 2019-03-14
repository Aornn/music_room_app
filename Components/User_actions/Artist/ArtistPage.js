import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator, Alert, TouchableOpacity, FlatList } from 'react-native'
import firebase from 'react-native-firebase';
import { GoogleSignin } from 'react-native-google-signin';
import Axios from 'axios';
import DispSongsArtistPage from './DispSongsArtistPage'
import { Appbar, Searchbar } from 'react-native-paper';



class ArtistPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            is_load: true,
            refresh: false,
            artist: {},
            artist_song: undefined,
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

    async componentDidMount() {
        this.setState({ is_load: true })
        var user = firebase.auth().currentUser
        var artist = this.props.navigation.state.params.artist
        var response = await Axios.get('https://api.deezer.com/artist/' + artist.id + '/top?limit=30')
        var artist_song = response.data.data
        if (user === null) {
            try {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
            }
            catch{ }
            this.props.navigation.navigate('Login')
        }
        this.setState({ user, is_load: false, artist, artist_song })
    }
    render() {
        return (
            <SafeAreaView style={styles.main_container}>
                <Appbar.Header>

                    <Appbar.BackAction
                        onPress={() => this.props.navigation.goBack()}
                    />
                    <Appbar.Content
                        title={this.state.artist.name}
                        subtitle={this.state.artist.nb_fan + " fans"}
                    />
                </Appbar.Header>
                <FlatList
                    data={this.state.artist_song}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <DispSongsArtistPage song={item} nav={this.props.navigation} />}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#191414',

    },
    manage: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    loading_container: {
        zIndex : 1,
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
        paddingLeft: 20,
        color: "#FFFFFF",
        fontSize: 20,
    },
    button: {
        flexDirection: 'row',
        // backgroundColor : '#FF0000',
        height: 30,
        marginRight: 2,
        marginLeft: 2,
        marginTop: 20,
        borderRadius: 5,

    }
})


export default ArtistPage