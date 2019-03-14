import React from 'react'
import {SafeAreaView, View, StyleSheet, TextInput, ActivityIndicator, Button, Text, Alert} from 'react-native'
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
				this.props.navigation.navigate('Login')
			})
			.catch((err) => {
				this.setState({is_load: false, error: err.message})
			})

	}


	render() {
		const showButton = formatEmail.test(this.state.user_email.trim()) && !this.state.error
		return (
			<SafeAreaView style={styles.main_container}>
				<Text style={styles.titre}>Connexion</Text>
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
		color: 'red'
	}
})


export default ForgotPwd