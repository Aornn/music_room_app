import React from 'react'
import {
	SafeAreaView,
	View,
	TextInput,
	StyleSheet,
	Text,
	ActivityIndicator,
	Alert,
	TouchableOpacity
} from 'react-native'
import firebase from 'react-native-firebase';
import { formatEmail, formatPseudo, formatPwd} from "./utils/validation";

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
		};
	}

	_displayLoading() {
		if (this.state.is_load) {
			return (
				<View style={styles.loading_container}>
					<ActivityIndicator size='large'/>
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
		this.setState({is_load: true})
		if (this.state.user_pseudo.length < 4) {
			Alert.alert("OUPS", "Pseudo trop court ...",
				[
					{text: 'OK'}
				],
				{cancelable: false})
			this.setState({is_load: false})
		}
		else {

			this.setState({is_load: true})
			await firebase.auth().createUserWithEmailAndPassword(this.state.user_email.trim(), this.state.user_pwd.trim())
			const user = firebase.auth().currentUser
			token = await this._getToken(user)
			await user.updateProfile({displayName: this.state.user_pseudo.trim()})
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


	_showSendButton() {
		const { conf_pwd, user_pwd, user_email, user_pseudo} = this.state
		const error = () => {
			if (user_email.length > 0 && !(formatEmail.test(user_email))) {
				return "Invalid email address"
			}
			else if (user_pseudo.length > 0 && !(formatPseudo.test(user_pseudo))) {
				return "Invalid pseudo. Must have at least 6 characters"
			}
			else if (user_pwd.length > 0 && (user_pwd.length < 6 || !(formatPwd.test(user_pwd)))) {
				return "Le mot de passe doit etre plus long que 6 caractères et avoir au moins un caractère spécial"
			}
			else if (user_pwd.length > 0 && conf_pwd.length < user_pwd.length ) {
				return ""
			}
			else if (user_pwd.length > 0) {
				return 'Les mots de passes ne correspondent pas'
			}

		}
		if (user_pwd.length > 6 && formatPwd.test(user_pwd) && user_pwd === conf_pwd && formatEmail.test(user_email)) {
			return (
				<View style={{alignItems: 'center'}}>
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
				<View style={{alignItems: 'center', paddingLeft: 10, paddingRight: 10}}>
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
				<TextInput
					placeholder="Email"
					placeholderTextColor="#8c8c8c"
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
					placeholder="Pseudo"
					placeholderTextColor="#8c8c8c"
					style={styles.textInput}
					onChangeText={(text) => {
						this.setState({
								user_pseudo: text
							}
						)
					}}
				/>
				<TextInput
					placeholder="Mot de passe"
					placeholderTextColor="#8c8c8c"
					secureTextEntry={true}
					style={styles.textInput}
					onChangeText={(value) => {this.setState({user_pwd: value})}}
				/>
				<TextInput
					placeholder="Mot de passe confirmation"
					placeholderTextColor="#8c8c8c"
					secureTextEntry={true}
					style={styles.textInput}
					onChangeText={(value) => {this.setState({conf_pwd: value})}}
				/>
				{this._showSendButton()}
				<View style={{alignItems: 'center'}}>
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
		marginLeft: 5,
		marginRight: 5,
		marginTop: 5,
		marginBottom: 5,
		height: 35,
		borderColor: '#9f9f9f',
		borderRadius: 5,
		borderWidth: 1,
		paddingLeft: 5,
		color: 'white',
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