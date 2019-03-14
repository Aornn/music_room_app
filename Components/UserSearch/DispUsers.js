import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'

class DispUsers extends React.Component {

    render() {
        const res = this.props.user

        return (
            <TouchableOpacity style={song_css.vue} onPress={async () => {
                this.props.nav.navigate('SearchUserProfil', {id:res.id})
            }} >
                <View style={song_css.desc}>
                    <Text style={song_css.titre}>{res.displayName}</Text>
                </View>
            </TouchableOpacity>
        )
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

export default DispUsers