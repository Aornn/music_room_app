import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import TrackPlayer from 'react-native-track-player';
import { MaterialDialog } from 'react-native-material-dialog';

class DispSongsSearchArtistPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }
    render() {
        const res = this.props.song
        if (res.type == 'track') {
            return (
                <TouchableOpacity style={song_css.vue} onPress={async () => {
                    await TrackPlayer.reset()
                    await TrackPlayer.add({
                        id: res.id,
                        artwork: res.album.cover_xl,
                        url: res.preview,
                        title: res.title_short,
                        artist: res.artist.name,
                        album: res.album.title,
                    });

                    TrackPlayer.play();
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
                                await TrackPlayer.add({
                                    id: res.id,
                                    artwork: res.album.cover_xl,
                                    url: res.preview,
                                    title: res.title_short,
                                    artist: res.artist.name,
                                    album: res.album.title,
                                })
                                this.setState({ visible: false })
                            }}>
                                <Text style={{ fontSize: 25, color: '#FFFFFF', padding: 10, fontWeight: 'bold', textAlign: 'center' }}>Ajouter à la file d'attente</Text>
                            </TouchableOpacity>
                        </View>
                    </MaterialDialog>
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

export default DispSongsSearchArtistPage