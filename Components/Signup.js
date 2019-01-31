import React from 'react'
import { SafeAreaView, View, TextInput, Button, StyleSheet, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native'
import firebase from 'react-native-firebase';
import axios from 'axios';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('test_react_native');
        this.state = {
            user_email: '',
            user_pwd: '',
            user_pseudo: '',
            is_load: false,
            conf_pwd: '',
            show_send_button: false,
        };
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
    _getToken(user) {
        return user.getIdToken().then((token) => {
            return token
        })
    }
    async _signup() {
        this.setState({ is_load: true })
        console.log("Username : " + this.state.user_email + "| PWD : " + this.state.user_pwd);
        if (this.state.user_pseudo.length < 4) {
            Alert.alert("OUPS", "Pseudo trop court ...",
                [
                    { text: 'OK' }
                ],
                { cancelable: false })
            this.setState({ is_load: false })
        }
        else {

            this.setState({ is_load: true })
            await firebase.auth().createUserWithEmailAndPassword(this.state.user_email, this.state.user_pwd)
            var user = firebase.auth().currentUser
            token = await this._getToken(user)
            console.log("tok : " + token)
            await user.updateProfile({ displayName: this.state.user_pseudo })
            user.sendEmailVerification()
            let config = {
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                method: 'POST'
            }
            await fetch('https://us-central1-music-room-42.cloudfunctions.net/initUser', config)
            await firebase.auth().signOut()
            this.props.navigation.navigate('Login')
        }
    }
    _checkPwd(pwd) {
        if (pwd != this.state.user_pwd) {
            this.setState({ show_send_button: false, conf_pwd: pwd })
        }
        else {
            this.setState({ show_send_button: true, conf_pwd: pwd })
        }
    }
    _showSendButton() {
        var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/

        if (this.state.show_send_button) {
            return (
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this._signup()}
                        underlayColor='#fff'>
                        <Text style={styles.inscription_but}>VALIDER !</Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else {
            if (this.state.user_pwd.length < 6 || !(format.test(this.state.user_pwd))) {
                return (
                    <View style={{ alignItems: 'center', paddingLeft: 10, paddingRight: 10 }}>
                        <Text>Le mot de passe doit etre plus long que 6 caractères et avoir au moins un caractère spécial :(</Text>
                    </View>
                )
            }
            else {
                return (
                    <View style={{ alignItems: 'center' }}>
                        <Text>Les mots de passes ne correspondent pas :(</Text>
                    </View>
                )
            }

        }
    }

    render() {
        return (
            <SafeAreaView style={styles.main_container}>
                <Text style={styles.inscription} >Inscription</Text>
                <TextInput
                    placeholder="Email"
                    style={styles.textinput}
                    onChangeText={(text) => {
                        this.setState({
                            user_email: text
                        }
                        )
                    }}
                />
                <TextInput
                    placeholder="Pseudo"
                    style={styles.textinput}
                    onChangeText={(text) => {
                        this.setState({
                            user_pseudo: text
                        }
                        )
                    }}
                />
                <TextInput
                    placeholder="Mot de passe"
                    secureTextEntry={true}
                    style={styles.textinput}
                    onChangeText={(text) => {
                        // this.setState({user_pwd: text})
                        if (text !== this.state.conf_pwd) {
                            this.setState({ user_pwd: text, show_send_button: false })
                        }
                        else {
                            this.setState({ user_pwd: text, show_send_button: true })
                        }
                    }}
                />
                <TextInput
                    placeholder="Mot de passe"
                    secureTextEntry={true}
                    style={styles.textinput}
                    onChangeText={(pwd) => this._checkPwd(pwd)}
                />
                {this._showSendButton()}
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.props.navigation.navigate('Login')}>
                        <Text style={styles.inscription_but}>Deja un compte ? Se Connecter</Text>
                    </TouchableOpacity>
                </View>
                {this._displayLoading()}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
    },
    inscription: {
        fontSize: 25,
        textAlign: 'center',
        color: "#FFFFFF",
        backgroundColor: "rgb(55,128,243)",
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 20,
    },
    button: {
        height: 50,
        width: 300,
        marginTop: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    inscription_but: {
        color: "rgb(55,128,243)",
        textAlign: 'center',
        fontSize: 18
    },
    textinput: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        height: 35,
        borderColor: '#9f9f9f',
        borderRadius: 5,
        borderWidth: 1,
        paddingLeft: 5,
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
    }
})


export default Signup