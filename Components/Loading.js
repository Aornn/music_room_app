import React from 'react'
import { View, TextInput, Button, StyleSheet, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native'
import firebase from 'react-native-firebase';
import axios from 'axios';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_load: true,
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
    componentDidMount() {
        var user = firebase.auth().currentUser
        if (user === null) {
            this.props.navigation.navigate('Signup')
        }
        else {
            this.props.navigation.navigate('Main')
        }

    }
    render() {
        return (
            <View style={styles.main_container}>
                {this._displayLoading()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        marginTop: 20,
    },
    titre: {
        fontSize: 25,
        textAlign: 'center',
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
})


export default Signup