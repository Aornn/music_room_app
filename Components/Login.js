import React from 'react'
import { SafeAreaView, View, Button, StyleSheet, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native'
import firebase from 'react-native-firebase';
import { TextInput, TouchableRipple } from 'react-native-paper';
import axios from 'axios';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_load: false,
            user_email: '',
            user_pwd: '',
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

    async _login() {
        this.setState({ is_load: true })
        if (this.state.user_email.length > 0 && this.state.user_pwd.length > 5) {
            console.log("Email : " + this.state.user_email + "| mdp : " + this.state.user_pwd)
            await firebase.auth().signInWithEmailAndPassword(this.state.user_email, this.state.user_pwd)
            var user = firebase.auth().currentUser
            if (user.emailVerified === false) {
                this.setState({ is_load: false })
                Alert.alert("OUPS", "Votre email n'est pas valide vous devez le valider",
                    [
                        {
                            text: "Se connecter", onPress: async () => {
                                await firebase.auth().signOut()
                                this.props.navigation.navigate('Login')
                            }
                        }
                    ],
                    { cancelable: false })
            }
            else {
                this.props.navigation.navigate('Main')
            }
        }
        else {
            Alert.alert("OUPS", "aucune informations",
                [
                    { text: 'OK' }
                ],
                { cancelable: false })
            this.setState({ is_load: false })
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.main_container}>
                <Text style={styles.titre} >Connexion</Text>
                <TextInput
                    mode='outlined'
                    label="Email"
                    onChangeText={(email) => {
                        this.setState({ user_email: email })
                    }} />
                <TextInput
                    mode='outlined'
                    label="Mot de passe"
                    secureTextEntry={true}
                    onChangeText={(pwd) => {
                        this.setState({ user_pwd: pwd })
                    }} />
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this._login()}
                        underlayColor='#fff'>
                        <Text style={styles.text_btn}>Se connecter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.props.navigation.navigate('Signup')}
                        underlayColor='#fff'>
                        <Text style={styles.text_btn}>S'inscrire</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.props.navigation.navigate('ForgotPwd')}
                        underlayColor='#fff'>
                        <Text style={styles.text_btn}>Mot de passe oublié</Text>
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
    titre: {
        fontSize: 25,
        textAlign: 'center',
        color: "#FFFFFF",
        backgroundColor: "rgb(55,128,243)",
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 20,
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
    text_btn: {
        color: "rgb(55,128,243)",
        textAlign: 'center',
        fontSize: 18
    },
    button: {
        height: 50,
        width: 300,
        marginTop: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    }
})


export default Signup