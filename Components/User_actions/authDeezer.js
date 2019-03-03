import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator, WebView } from 'react-native'
import { Appbar, TextInput, Checkbox, Button } from 'react-native-paper';
import firebase, { firestore } from 'react-native-firebase';
import Axios from 'axios';
class ModifUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user : {}
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
        var user = firebase.auth().currentUser
        if (user === null) {
            this.props.navigation.navigate('Signup')
        }
        this.setState({ user, is_load: false })
    }
    _onNavigationStateChange(webViewState){
        my_url = webViewState.url
        console.log(my_url)
        if (my_url.includes('https://connect.deezer.com/oauth/auth.php?app_id=332122&redirect_uri=https://us-central1-music-room-42.cloudfunctions.net/callbackDeezer&perms=basic_access,email') === false)
        {
            firebase.firestore().collection('users').doc(this.state.user._user.uid).update({
                is_linked_to_deezer : true
            })
            this.props.navigation.navigate('UserProfil')
        }
      }

    render() {
        const { displayName } = this.state
        return (
            <SafeAreaView style={styles.main_container}>
                <Appbar.Header>
                    <Appbar.BackAction
                        onPress={() => this.props.navigation.navigate('UserProfil')}
                    />
                    <Appbar.Content
                        title="Modifier Compte"
                    />
                </Appbar.Header>
                <WebView
                    source={{ uri: 'https://connect.deezer.com/oauth/auth.php?app_id=332122&redirect_uri=https://us-central1-music-room-42.cloudfunctions.net/callbackDeezer&perms=basic_access,email' }}
                    onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                    style={{ marginTop: 20 }}
                />
                {this._displayLoading()}
            </SafeAreaView >
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#191414',
    },
    loading_container: {
        zIndex: 10,
        position: 'absolute',
        backgroundColor: '#191414',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        margin: 5,
        borderRadius: 5,
        backgroundColor: '#191414',
        borderWidth: 1,
        borderColor: '#FFFFFF'

    },
    titre: {
        padding: 5,
        color: '#FFFFFF',
        fontSize: 20,
    },
    text: {
        paddingTop: 5,
        color: '#FFFFFF',
        fontSize: 15,
    },
})


export default ModifUser