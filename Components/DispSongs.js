import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import SoundPlayer from 'react-native-sound-player'
import Feather from 'react-native-vector-icons/Feather'
import firebase from 'react-native-firebase';

class DispSongs extends React.Component {
    _AddNav(res) {
        if (this.props.nav !== undefined) {
            return (
                <Feather onPress={() => {
                    SoundPlayer.stop()
                    this.props.nav.navigate('AddPlaylist', { song: res })
                }} style={{ marginLeft: 10, marginTop: 5, marginRight: 5, textAlignVertical: 'center', }} name='plus-circle' size={30} color="white"></Feather>
            )
        }
    }
    _PerformDelete(res, id_playlist) {
        firebase.firestore().collection('playlist').doc(id_playlist).update({
            titles: firebase.firestore.FieldValue.arrayRemove(res)
        })

    }
    //ajouter dans cette fonction une condition qui permet de se subscribe à une playlist donc changer la fct dans getalluserplaylsit
    _DeleteSong(res, id_playlist, owner, uid) {
        if (res.in_Playlist === true && owner === uid) {
            return (
                <Feather onPress={() => this._PerformDelete(res, id_playlist)} style={{ marginLeft: 10, marginTop: 5, marginRight: 5, textAlignVertical: 'center', }} name='minus-circle' size={30} color="white"></Feather>
            )
        }
    }

    render() {
        const res = this.props.song
        const id_playlist = this.props.id
        const owner = this.props.owner
        const uid = this.props.uid
        if (res.type == 'track') {
            return (
                <TouchableOpacity style={song_css.vue} onPress={() => {
                    console.log('in : ' + res.preview)
                    try {
                        SoundPlayer.playUrl(res.preview)

                    }
                    catch (e) {
                        console.log('eer' + e)
                    }
                }} >
                    <Image
                        style={song_css.image}
                        source={{ uri: res.album.cover_xl }}
                    />
                    <View style={song_css.desc}>
                        <Text style={song_css.titre}>{res.title_short}</Text>
                        <Text style={song_css.underline}>{res.artist.name}</Text>
                        <Text style={song_css.underline}>Chanson</Text>
                    </View>
                    <Feather onPress={() => SoundPlayer.stop()} style={{ marginLeft: 10, marginTop: 5, marginRight: 5, textAlignVertical: 'center', }} name='stop-circle' size={30} color="white"></Feather>
                    {this._AddNav(res)}
                    {this._DeleteSong(res, id_playlist, owner, uid)}
                </TouchableOpacity>
            )
        }
        else {
            return (
                <TouchableOpacity style={song_css.vue}>

                    <Image
                        style={song_css.image}
                        source={{ uri: res.picture_xl }}
                    />
                    <View style={song_css.desc}>
                        <Text style={song_css.titre}>{res.name}</Text>
                        <Text style={song_css.underline}>Artiste</Text>
                    </View>

                </TouchableOpacity>
            )
        }

    }
}

const song_css = {
    vue:
    {
        flexDirection: 'row',
        backgroundColor: 'rgb(18,18,18)',
        borderRadius: 5,
        margin: 5,
        flex: 1,
    },
    underline: {
        color: '#FFFFFF'
    },
    desc: {
        flex: 1,
        marginLeft: 5,
        padding: 5,
    },
    titre:
    {
        flexWrap: 'wrap',
        color: '#FFFFFF',
        padding: 5,
        fontSize: 20,
        // marginBottom: 5,
        fontFamily: 'sans-serif-medium',
    },
    image: {
        borderRadius: 100,
        width: 60,
        height: 60,
        margin: 5,
    },
}

export default DispSongs