import React from 'react'
import {
	SafeAreaView,
	View,
	StyleSheet,
	Text,
	ActivityIndicator,
	Alert,
	TouchableOpacity
} from 'react-native'
import { TextInput, TouchableRipple } from 'react-native-paper';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';

import firebase from 'react-native-firebase';
import { formatEmail, formatPseudo, formatPwd } from "./../utils/validation";

class Signup extends React.Component {
	constructor(props) {
		super(props);
		this._user = firebase.auth().currentUser ? firebase.auth().currentUser : null
		this.state = {
			user_email: '',
			user_pwd: '',
			user_pseudo: '',
			is_load: true,
			conf_pwd: '',
		};
	}

	componentDidMount() {
		// var user = firebase.auth().currentUser ? firebase.auth().currentUser : null //var user = firebase.auth().currentUser
		// if (user !== null) {
		// 	console.log('sign')
		// 	console.log(user)
		// 	this.props.navigation.navigate('UserProfil')
		// }
		this.setState({is_load : false})
	}

	onLoginOrRegister = async () => {
		// Add any configuration settings here:

		await GoogleSignin.configure({
			webClientId: '361260648605-c0fvnokdq34qb4o165pfjmmqimh3g68h.apps.googleusercontent.com'
		});
		var data = undefined
		try {
			data = await GoogleSignin.signIn();
			this.setState({ is_load: true })
		}
		catch{
			this.setState({ is_load: false })
		}
		if (data !== undefined) {
			const credential = await firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
			await firebase.auth().signInWithCredential(credential);
			const user = await firebase.auth().currentUser
			firebase.firestore().collection('users').doc(user._user.uid).get()
				.then(async (snap) => {
					if (!snap.exists) {
						await firebase.firestore().collection('users').doc(user._user.uid).set({
							accessibility: {
								friends: true,
								public: true
							},
							displayName: user._user.displayName,
							friends: [],
							pref_music: [],
							is_linked_to_google: true,
							is_linked_to_facebook: false,
							is_linked_to_deezer: false
						})
						await firebase.firestore().collection('hash_users').doc(user._user.email).set({
							uid: user._user.uid
						})
					}
					this.props.navigation.navigate('UserProfil')
				})
		}


	};
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
			await firebase.auth().createUserWithEmailAndPassword(this.state.user_email.trim(), this.state.user_pwd.trim())
			const user = firebase.auth().currentUser
			// if (user === null) {
			// 	console.log('Signup')
			// 	this.props.navigation.navigate('Signup')
			// }
			token = await this._getToken(user)
			await user.updateProfile({ displayName: this.state.user_pseudo.trim() })
			user.sendEmailVerification()
			let config = {
				headers: {
					'Authorization': 'Bearer ' + token
				},
				method: 'POST'
			}
			await fetch('https://us-central1-music-room-42.cloudfunctions.net/initUser', config)
			await firebase.auth().signOut()
			this.props.navigation.navigate('Signup')
		}
	}


	_showSendButton() {
		const { conf_pwd, user_pwd, user_email, user_pseudo } = this.state
		const error = () => {
			if (user_email.length > 0 && !(formatEmail.test(user_email))) {
				return "Invalid email address"
			}
			else if (user_pseudo.length > 0 && !(formatPseudo.test(user_pseudo))) {
				return "Invalid pseudo. Must have at least 6 characters"
			}
			else if (user_pwd.length > 0 && (user_pwd.length < 6)) {
				return "Le mot de passe doit etre plus long que 6 caractères"
			}
			else if (user_pwd.length > 0 && conf_pwd.length < user_pwd.length) {
				return ""
			}
			else if (user_pwd.length > 0) {
				return 'Les mots de passes ne correspondent pas'
			}

		}
		if (user_pwd.length > 6 && user_pwd === conf_pwd && formatEmail.test(user_email)) {
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
			return (
				<View style={{ alignItems: 'center', paddingLeft: 10, paddingRight: 10 }}>
					<Text style={styles.errorText}>
						{error()}
					</Text>
				</View>
			)
		}
	}

	render() {
		return (
			<SafeAreaView style={styles.main_container}>
				<Text style={styles.inscription}>Inscription</Text>
				{/* 
				<TextInput
                    mode='flat'
                    label="Titre de la playlist"
                    theme={{ colors: { background: '#FFFFFF', primary: '#FFFFFF' } }}
                    value={this.state.titre}
                    style={styles.textInput}
                    onChangeText={(titre) => {
                        this.setState({ titre })
                    }} /> */}

				<TextInput
					theme={{ colors: { background: '#FFFFFF', primary: '#FFFFFF' } }}
					mode='flat'
					value={this.state.user_email}
					label="Email"
					keyboardType="email-address"
					style={styles.textInput}
					onChangeText={(text) => {
						this.setState({
							user_email: text.toLowerCase()
						}
						)
					}}
				/>
				<TextInput
					theme={{ colors: { background: '#FFFFFF', primary: '#FFFFFF' } }}
					mode='flat'
					value={this.state.user_pseudo}
					label="Pseudo"
					style={styles.textInput}
					onChangeText={(text) => {
						this.setState({
							user_pseudo: text
						}
						)
					}}
				/>
				<TextInput
					theme={{ colors: { background: '#FFFFFF', primary: '#FFFFFF' } }}
					mode='flat'
					value={this.state.user_pwd}
					label="Mot de passe"
					secureTextEntry={true}
					style={styles.textInput}
					onChangeText={(value) => {
						this.setState({ user_pwd: value })
					}}
				/>
				<TextInput
					theme={{ colors: { background: '#FFFFFF', primary: '#FFFFFF' } }}
					mode='flat'
					value={this.state.conf_pwd}
					label="Mot de passe confirmation"
					secureTextEntry={true}
					style={styles.textInput}
					onChangeText={(value) => {
						this.setState({ conf_pwd: value })
					}}
				/>
				{this._showSendButton()}
				<View style={{ alignItems: 'center' }}>
					<GoogleSigninButton
						style={{ width: 300, height: 50 }}
						size={GoogleSigninButton.Size.Wide}
						color={GoogleSigninButton.Color.Light}
						onPress={this.onLoginOrRegister}
					/>
					<TouchableOpacity
						style={styles.button}
						onPress={() => this.props.navigation.navigate('Signup')}>
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
		backgroundColor: '#191414',
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
		backgroundColor: '#191414',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
	},
	inscription_but: {
		color: "rgb(55,128,243)",
		textAlign: 'center',
		fontSize: 18
	},
	textInput: {
		margin: 5,
		borderRadius: 5,
		backgroundColor: '#191414',
		borderWidth: 1,
		borderColor: '#FFFFFF'

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
	errorText: {
		color: 'red'
	}
})


export default Signup