import React from 'react'
import { SafeAreaView, View, Button, StyleSheet, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native'
import firebase from 'react-native-firebase';
import { TextInput, TouchableRipple } from 'react-native-paper';
import { formatEmail, formatPwd } from "./utils/validation";

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
    	const {user_email, user_pwd} = this.state
        const succeed = true
        this.setState({ is_load: true })
        if (user_email.length > 0 && user_pwd.length > 5) {
            console.log("Email : " + user_email + "| mdp : " + user_pwd)
            await firebase.auth().signInWithEmailAndPassword(user_email.trim(), user_pwd.trim())
                .catch(() => {
                    succeed = false
                })
            if (succeed) {
                var user = firebase.auth().currentUser
                if (user.emailVerified === false) {
                    this.setState({ is_load: false })
                    Alert.alert("OUPS", "Votre email n'est pas valide vous devez le valider",
                        [{
                                text: "OK", onPress: async () => {
                                    await firebase.auth().signOut()
                                    this.props.navigation.navigate('Login')
                                }
                            }],
                        { cancelable: false })
                }
                else {
                    this.props.navigation.navigate('Main')
                }
            }
            else {
                this.setState({ is_load: false })
                Alert.alert("OUPS", "Mauvaise combinaison Email et mot de passe",
                    [
                        {
                            text: "OK", onPress: async () => {
                                this.props.navigation.navigate('Login')
                            }
                        }
                    ],
                    { cancelable: false })
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
    	const { user_email, user_pwd } = this.state
	    const showLoginButton = formatPwd.test(user_pwd) && formatEmail.test(user_email)
	    return (
            <SafeAreaView style={styles.main_container}>
                <Text style={styles.titre} >Connexion</Text>
                <TextInput
	                keyboardType="email-address"
	                mode='outlined'
                    label="Email"
	                value={user_email}
	                style={styles.textInput}
                    onChangeText={(email) => {
                        this.setState({ user_email: email })
                    }} />
                <TextInput
	                mode='outlined'
                    label="Mot de passe"
	                value={user_pwd}
                    secureTextEntry={true}
	                style={styles.textInput}
                    onChangeText={(pwd) => {
                        this.setState({ user_pwd: pwd })
                    }} />
	            <View style={{ alignItems: 'center', flexGrow: 1 }}>
		            {showLoginButton && <TouchableOpacity
			            style={styles.buttonHighlight}
			            activeOpacity={1}
			            onPress={() => this._login()}
			            underlayColor='#fff'>
			            <Text style={styles.text_btn}>Se connecter</Text>
		            </TouchableOpacity>}
	            </View>
                <View style={{ alignItems: 'center'}}>
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
        backgroundColor : '#191414',
	    color: 'white'
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
        backgroundColor : '#191414',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
    	color: 'white'
    },
    text_btn: {
        color: "rgb(55,128,243)",
        textAlign: 'center',
        fontSize: 18
    },
	buttonHighlight: {
		height: 50,
		width: 300,
		marginTop: 20,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: '#FFF',
	},
    button: {
        height: 50,
        width: 300,
        marginTop: 20,
        backgroundColor : '#191414',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    }
})


export default Signup