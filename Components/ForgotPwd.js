import React from 'react'
import {
	SafeAreaView, View, StyleSheet, TextInput, ActivityIndicator, Button, Text, Alert,
	TouchableOpacity
} from 'react-native'
import firebase from 'react-native-firebase';
import {formatEmail} from "./../utils/validation";

class ForgotPwd extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user_email: '',
			is_load: false,
			error: false
		}

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

	_forgotPWD() {
		this.setState({is_load: true})
		firebase.auth().sendPasswordResetEmail(this.state.user_email.trim())
			.then(() => {
				this.setState({is_load: false})
				Alert.alert("Check your emails!", "You received a link to reset your password",
					[
						{
							text: "OK", onPress: async () => {
								this.props.navigation.navigate('Login')
							}
						}
					],
					{cancelable: false})
				console.log("sucess")
			})
			.catch((err) => {
				this.setState({is_load: false, error: "Sorry, we couldn't find a user linked ot this email address"})
				console.log(err)
			})

	}


	render() {
		const showButton = formatEmail.test(this.state.user_email.trim()) && !this.state.error
		return (
			<SafeAreaView style={styles.main_container}>
				<Text style={styles.titre}>Connexion</Text>
				<View>
					<TextInput
						placeholder="Email"
						style={styles.textInput} onChangeText={(email) => {
						this.setState({user_email: email, error: false})
					}}/>
					<Button
						title='Envoyer'
						disabled={!showButton}
						onPress={() => this._forgotPWD()}
					/>
					{this.state.error && <View style={{alignItems: 'center', paddingLeft: 10, paddingRight: 10}}>
						<Text style={styles.errorText}>
							{this.state.error}
						</Text>
					</View>}
				</View>

				<View style={{alignItems: 'center', justifyContent: 'flex-end', flexGrow: 1}}>
					<TouchableOpacity
						style={styles.button}
						onPress={() => this.props.navigation.navigate('Signup')}
						underlayColor='#fff'>
						<Text style={styles.text_btn}>Sign up</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.button}
						onPress={() => this.props.navigation.navigate('Login')}
						underlayColor='#fff'>
						<Text style={styles.text_btn}>Log in</Text>
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
		// justifyContent: 'space-between',
		backgroundColor: '#191414',
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
	textInput: {
		color: 'white'
	},
	errorText: {
		color: 'red',
		margin: 20,
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
	text_btn: {
		color: "rgb(55,128,243)",
		textAlign: 'center',
		fontSize: 18
	},
})


export default ForgotPwd