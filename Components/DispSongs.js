import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import SoundPlayer from 'react-native-sound-player'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
class DispSongs extends React.Component {
    render() {
        const song = this.props.song
        const url_img = song.album.cover_xl
        return (
            <TouchableOpacity style={song_css.vue} >
                <View style={song_css.content}>
                    <Image
                        style={song_css.image}
                        source={{ uri: url_img }}
                    />
                    <Text style={song_css.titre}>{song.title_short}</Text>
                    <AntDesign onPress={() => SoundPlayer.playUrl(song.preview)} style={{marginLeft : 5, marginRight :5}} name='play' size={30} color="white"></AntDesign>
                    <Feather onPress={() => SoundPlayer.pause()} style={{marginLeft : 5, marginRight :5}} name='stop-circle' size={30} color="white"></Feather>
                </View>
            </TouchableOpacity>
        )
    }
}

const song_css = {
    vue:
    {
        backgroundColor: '#000000',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#d6d7da',
        marginTop: 5,
        flex: 1,
    },
    content : 
    {
        flexDirection : 'row',
    },
    titre:
    {

        color: '#FFFFFF',
        paddingTop: 5,
        paddingBottom: 5,
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 10,
        fontFamily: 'sans-serif-medium',
    },
    image: {
        width: 50,
        height: 50,
    },
}

export default DispSongs