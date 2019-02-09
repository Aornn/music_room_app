import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator, FlatList} from 'react-native'
import { getAllPublicEvent } from '../../API/getAllPublicEvent'
import firebase from 'react-native-firebase';

class Event extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            event: [],
            is_load: true
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
    _displayEvent() {

    }
    componentDidMount(){
        var user = firebase.auth().currentUser
        if (user === null) {
            this.props.navigation.navigate('Signup')
        }
        navigator.geolocation.getCurrentPosition(position => {
            console.log(position)
            var timestamp = Math.floor(Date.now() / 1000)
            getAllPublicEvent(user,position.coords.longitude, position.coords.latitude,timestamp).then((data) => {
                this.setState({is_load : false,user, event : data })
            })
        })
    }
    render() {
        return (
            <SafeAreaView style={styles.main_container}>
                {this._displayEvent()}
                {this._displayLoading()}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor : '#191414',
        color : '#FFFFFF'

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
    }
})


export default Event