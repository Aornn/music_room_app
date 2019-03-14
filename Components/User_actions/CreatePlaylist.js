import React from 'react'
import { SafeAreaView, View, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Text } from 'react-native'
import { Appbar, TextInput} from 'react-native-paper';
import { Dropdown } from 'react-native-material-dropdown';

class CreatePlaylist extends React.Component {
    constructor(props) {
        super(props);
        this.style_song = [{ value: 'jazz', }, { value: 'electro', }, { value: 'classique', }, { value: 'pop', }, { value: 'hip-hop', }, { value: 'rock', }, { value: 'chill', }, { value: 'ambiance', }, { value: 'latino', }, { value: 'affro', }, { value: 'rnb', }, { value: 'Rap', }];
        this.state = {
            user: {},
            is_load: false,
            titre: '',
            genre: 'jazz',
        }

    }
    _getToken(user) {
        return user.getIdToken().then((token) => {
            return token
        })
    }

    async _CreateP() {
        if (this.state.titre.length < 1) {
            Alert.alert("OUPS", "Veuillez renseigner un titre",
                [
                    {
                        text: "OK"
                    }
                ],
                { cancelable: false })
        }
        else {
            var token = await this._getToken(this.props.navigation.state.params.user)
            let config = {
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                method: 'POST'
            }
            this.setState({ is_load: true })
            fetch('https://us-central1-music-room-42.cloudfunctions.net/createPlaylist?playlistName=' + this.state.titre + '&genre=' + this.state.genre, config)
                .then(() => {
                    this.props.navigation.goBack()
                })
                .catch((err) => {
                    this.setState({ is_load: false })
                })
        }

    }
    componentDidMount() {
        this.setState({ user: this.props.navigation.state.params.user })
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
    render() {
        return (
            <SafeAreaView style={styles.main_container}>
                <Appbar.Header>
                    <Appbar.BackAction
                        onPress={() => this.props.navigation.goBack()} // peut etre ajouter { change: 1 }
                    />
                    <Appbar.Content
                        title="Creer playlist"
                    />
                </Appbar.Header>
                <TextInput
                    mode='flat'
                    label="Titre de la playlist"
                    theme={{ colors: { background: '#FFFFFF', primary: '#FFFFFF' } }}
                    value={this.state.titre}
                    style={styles.textInput}
                    onChangeText={(titre) => {
                        this.setState({ titre })
                    }} />
                <Dropdown
                    onChangeText={(genre) => this.setState({ genre })}
                    label='Style'
                    labelFontSize={20}
                    itemTextStyle={{ fontSize: 20 }}
                    baseColor='rgba(255,255,255,1)'
                    textColor='rgba(255,255,255,1)'
                    selectedItemColor='rgba(0,0,0,1)'
                    itemColor='rgba(0,0,0,1)'
                    value='jazz'
                    data={this.style_song}
                    style={{ margin: 5 }}
                />
                <TouchableOpacity onPress={async () => {
                    this._CreateP()
                }}>
                    <Text style={{ fontSize: 25, color: '#FFFFFF', padding: 10, fontWeight: 'bold', textAlign: 'center' }}>Valider</Text>
                </TouchableOpacity>
                {this._displayLoading()}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#191414',
        color: "#FFFFFF",
    },
    textInput: {
        margin: 5,
        borderRadius: 5,
        backgroundColor: '#191414',
        borderWidth: 1,
        borderColor: '#FFFFFF'

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
})


export default CreatePlaylist