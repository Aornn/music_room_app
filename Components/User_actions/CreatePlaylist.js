import React from 'react'
import { SafeAreaView, View, StyleSheet, TextInput, ActivityIndicator, Picker, Button, Alert } from 'react-native'
import { Appbar } from 'react-native-paper';

class CreatePlaylist extends React.Component {
    constructor(props) {
        super(props);
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
            console.log("tok : " + token)
            let config = {
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                method: 'POST'
            }
            this.setState({ is_load: true })
            fetch('https://us-central1-music-room-42.cloudfunctions.net/createPlaylist?playlistName=' + this.state.titre + '&genre=' + this.state.genre, config)
                .then(() => {
                    console.log("Done")
                    this.props.navigation.goBack()
                })
                .catch((err) => {
                    this.setState({ is_load: false })
                    console.log(err.message)
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
                    style={{ color: '#000000', borderColor:'#FFFFFF',borderWidth: 0.5, backgroundColor : '#FFFFFF'}}
                    placeholder="Titre de la playlist"
                    onChangeText={(titre) => {
                        this.setState({ titre })
                    }}
                />
                <Picker style={{ color: '#000000' , borderColor:'#FFFFFF', borderWidth: 0.5, backgroundColor : '#FFFFFF'}} selectedValue={this.state.genre} onValueChange={(genre) => this.setState({ genre })}>
                    <Picker.Item label="Jazz" value="jazz" />
                    <Picker.Item label="Electro" value="electro" />
                    <Picker.Item label="Classique" value="classique" />
                    <Picker.Item label="Pop" value="pop" />
                    <Picker.Item label="Hip-hop" value="hip-hop" />
                    <Picker.Item label="Rock" value="rock" />
                    <Picker.Item label="Chill" value="chill" />
                    <Picker.Item label="Ambiance" value="ambiance" />
                    <Picker.Item label="Latino" value="latino" />
                    <Picker.Item label="Affro" value="affro" />
                    <Picker.Item label="RnB" value="rnb" />
                    <Picker.Item label="Rap" value="rap" />
                </Picker>
                <Button
                    title='Créer !'
                    onPress={() => this._CreateP()}
                />
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
})


export default CreatePlaylist
