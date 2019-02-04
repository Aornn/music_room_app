import React from 'react'
import {SafeAreaView, View, StyleSheet, TextInput, ActivityIndicator, Button, Text, Alert} from 'react-native'
import firebase from 'react-native-firebase';
import {formatEmail} from "./utils/validation";

class ForgotPwd extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user_email: '',
			is_load: false
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
		if (this.state.user_email.length > 0) {
			this.setState({is_load: true})
			firebase.auth().sendPasswordResetEmail(this.state.user_email.trim())
				.then(() => {
					console.log("sucess")
					this.props.navigation.navigate('Login')
				})
				.catch((err) => {
					this.setState({is_load: false})
					console.log(err)
				})

		}
		else {
			Alert.alert("OUPS", "Veuillez remplir le champ Email",
				[
					{text: 'OK'}
				],
				{cancelable: false})
		}
	}

	render() {
		const showButton = formatEmail.test(this.state.user_email.trim())
		return (
			<SafeAreaView style={styles.main_container}>
				<Text style={styles.titre}>Connexion</Text>
				<TextInput
					placeholder="Email"
					style={styles.textInput} onChangeText={(email) => {
					this.setState({user_email: email})
				}}/>
				<Button
					title='Envoyer'
					disabled={!showButton}
					onPress={() => this._forgotPWD()}
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
	}
})


export default ForgotPwd