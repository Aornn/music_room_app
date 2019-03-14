import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import firebase from 'react-native-firebase';
import TrackPlayer from 'react-native-track-player';
import { MaterialDialog } from 'react-native-material-dialog';

class DispSongsEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }

    }
    _addingVote(res, id_event, uid) {
        firebase.firestore().collection('vote').doc(id_event).update({
            [res.id]: firebase.firestore.FieldValue.arrayUnion(uid)
        })
    }
    _removingVote(res, id_event, uid) {
        firebase.firestore().collection('vote').doc(id_event).update({
            [res.id]: firebase.firestore.FieldValue.arrayRemove(uid)
        })
    }
    _PlusMinus(res, id_event, uid, vote) {
        if (vote[res.id] !== undefined && vote[res.id].includes(uid)) {
            return (
                <MaterialCommunityIcons onPress={() => this._removingVote(res, id_event, uid)} style={{ marginLeft: 10, marginTop: 5, marginRight: 5, textAlignVertical: 'center', }} name='thumb-up' size={30} color="white"></MaterialCommunityIcons>
            )

        }
        else {
            return (
                <MaterialCommunityIcons onPress={() => this._addingVote(res, id_event, uid)} style={{ marginLeft: 10, marginTop: 5, marginRight: 5, textAlignVertical: 'center', }} name='thumb-up-outline' size={30} color="white"></MaterialCommunityIcons>
            )

        }
    }
    //Par défaut tous le monde peut supprimer sinon seuls les user dans follower le peuvent
    _DeleteSong(res, id_playlist, owner, uid, follower, access) {
        if ((id_playlist !== undefined && owner !== undefined && uid !== undefined && follower !== undefined && access !== undefined) && (access.public === true || follower.includes(uid) || owner === uid)) {
            return (

                <TouchableOpacity onPress={() => {
                    this.setState({ visible: false })
                    firebase.firestore().collection('playlist').doc(id_playlist).update({
                        titles: firebase.firestore.FieldValue.arrayRemove(res)
                    })
                }}>
                    <Text style={{ fontSize: 25, color: '#FFFFFF', padding: 10, fontWeight: 'bold', textAlign: 'center' }}>Supprimer</Text>
                </TouchableOpacity>
            )
        }
    }

    _dispVote(vote, res) {
        let value = 0
        if  (vote[res.id] !== undefined && vote[res.id].length > 0) {
            value = vote[res.id].length
        }
        return (
            <Text style={song_css.underline}>Vote : {value}</Text>
        )
    }
    render() {
        const res = this.props.song
        if (res.type == 'track') {
            return (
                <TouchableOpacity style={song_css.vue} onPress={async () => {
                    // if (this.props.can_play) {
                    //     await TrackPlayer.reset()
                    //     await TrackPlayer.add({
                    //         id: res.id,
                    //         artwork: res.album.cover_xl,
                    //         url: res.preview,
                    //         title: res.title_short,
                    //         artist: res.artist.name,
                    //         album: res.album.title,
                    //     });
                    //     TrackPlayer.play();
                    // }
                }} >
                    <Image
                        style={song_css.image}
                        source={{ uri: res.album.cover_xl }}
                    />
                    <View style={song_css.desc}>
                        <Text style={song_css.titre}>{res.title_short}</Text>
                        <Text style={song_css.underline}>{res.artist.name}</Text>
                        {this._dispVote(this.props.vote, res)}
                        <Text style={song_css.underline}>Chanson</Text>
                    </View>
                    {this._PlusMinus(res, this.props.id, this.props.uid, this.props.vote)}
                    <MaterialCommunityIcons onPress={() => { this.setState({ visible: true }) }} style={{ marginLeft: 10, marginTop: 5, marginRight: 5, textAlignVertical: 'center', }} name='dots-vertical' size={30} color="white"></MaterialCommunityIcons>
                    <MaterialDialog
                        title="Que voulez vous faire ?"
                        titleColor='#FFFFFF'
                        visible={this.state.visible}
                        backgroundColor='rgba(0,0,0,1.0)'
                        onCancel={() => { this.setState({ visible: false }) }}>
                        <View>
                            <TouchableOpacity onPress={() => {
                                if (this.props.nav !== undefined) {
                                    this.setState({ visible: false })
                                    //SoundPlayer.stop()
                                    this.props.nav.navigate('AddEvent', { song: res })
                                }
                            }}>
                                <Text style={{ fontSize: 25, color: '#FFFFFF', padding: 10, fontWeight: 'bold', textAlign: 'center' }}>Evenement</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                if (this.props.nav !== undefined) {
                                    this.setState({ visible: false })
                                    //SoundPlayer.stop()
                                    this.props.nav.navigate('AddPlaylist', { song: res })
                                }
                            }}>
                                <Text style={{ fontSize: 25, color: '#FFFFFF', padding: 10, fontWeight: 'bold', textAlign: 'center' }}>Playlist</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={async () => {
                                if (this.props.can_play) {
                                    await TrackPlayer.add({
                                        id: res.id,
                                        artwork: res.album.cover_xl,
                                        url: res.preview,
                                        title: res.title_short,
                                        artist: res.artist.name,
                                        album: res.album.title,
                                    })
                                    this.setState({ visible: false })
                                }
                            }}>
                                <Text style={{ fontSize: 25, color: '#FFFFFF', padding: 10, fontWeight: 'bold', textAlign: 'center' }}>Ajouter à la file d'attente</Text>
                                {/* {this._DeleteSong(res, this.props.id, this.props.owner, this.props.uid, this.props.follower, this.props.access)} */}
                            </TouchableOpacity>
                        </View>
                    </MaterialDialog>
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

export default DispSongsEvent