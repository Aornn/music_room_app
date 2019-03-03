import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native'
import { getAllPublicEvent } from '../../API/getAllPublicEvent'
import firebase from 'react-native-firebase';
import { Appbar } from 'react-native-paper';

class Event extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            event: [],
            is_load: true,
            refresh: false
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

    _Onref = () => {
        console.log("onref")
        this.setState({ refresh: true, is_load: true })
        var user = firebase.auth().currentUser
        if (user === null) {
            this.props.navigation.navigate('Signup')
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(position)
                var timestamp = Math.floor(Date.now() / 1000)
                getAllPublicEvent(user, position.coords.longitude, position.coords.latitude, timestamp).then((data) => {
                    this.setState({ is_load: false, user, event: data, refresh: false })
                })
            },
            (error) => {
                Alert.alert("OK !", error.message,
                    [
                        {
                            text: "OK", onPress: () => {
                                firebase.auth().signOut().then(() => {
                                    this.props.navigation.navigate('Login')
                                })
                            }
                        }
                    ])
            },
            { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
        )
    }
    _displayEvent() {
        return (
            <FlatList
                data={this.state.event}
                extraData={this.state}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) =>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgb(18,18,18)', padding: 5, marginBottom: 5 }} onPress={() => {
                        this.props.navigation.navigate('EventDetailPub', { id: item.id })
                    }}>
                        <Text style={{ color: '#FFFFFF', fontSize: 20, marginLeft: 5 }}>{item.Name}</Text>
                        <Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 10 }}>Par {item.creator_name} • {item.titles.length} titres • {item.genre}</Text>
                    </TouchableOpacity>
                }
                refreshing={this.state.refresh}
                onRefresh={this._Onref}
            />
        )
    }
    componentDidUpdate(){
        if(this.props.navigation.state.params !== undefined && this.props.navigation.state.params.need_update === 1)
        {
            var indexOfEvent = this.state.event.findIndex(item => item.id === this.props.navigation.state.params.id);
            this.state.event.splice(indexOfEvent, 1);
            this.setState({event : this.state.event})
            this.props.navigation.state.params.need_update = 0
        }
    }
    componentDidMount() {
        var user = firebase.auth().currentUser
        if (user === null) {
            this.props.navigation.navigate('Signup')
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(position)
                var timestamp = Math.floor(Date.now() / 1000)
                getAllPublicEvent(user, position.coords.longitude, position.coords.latitude, timestamp).then((data) => {
                    this.setState({ is_load: false, user, event: data })
                })
            },
            (error) => {
                Alert.alert("OK !", error.message,
                    [
                        {
                            text: "OK", onPress: () => {
                                firebase.auth().signOut().then(() => {
                                    this.props.navigation.navigate('Login')
                                })
                            }
                        }
                    ])
            },
            { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
        )
    }
    render() {
        return (
            <SafeAreaView style={styles.main_container}>
                <Appbar.Header>
                    <Appbar.Content
                        title="Evenement Publique"
                    />
                </Appbar.Header>
                {this._displayEvent()}
                {this._displayLoading()}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#191414',
        color: '#FFFFFF'

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