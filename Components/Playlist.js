import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native'
import { getAllPublicPlaylist } from '../API/getAllPublicPlaylist'
import firebase from 'react-native-firebase';
import { List } from 'react-native-paper';
import { Appbar } from 'react-native-paper';

class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            token: '',
            playlist: [],
            refresh: false,
            is_load: false
        }

    }

    _Onref = () => {
        console.log("onref")
        this.setState({ refresh: true })
        var user = firebase.auth().currentUser
        if (user === null) {
            this.props.navigation.navigate('Signup')
        }
        getAllPublicPlaylist(user).then((p) => {
            this.setState({ user, playlist: p, refresh: false })
        })
    }

    _displayPlaylist() {
        return (
            <FlatList
                data={this.state.playlist}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) =>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgb(18,18,18)', padding: 5, marginBottom: 5 }} onPress={() => {
                        let id = item.id
                        this.props.navigation.navigate('PlaylistDetailPub', { id })
                    }}>
                        <Text style={{ color: '#FFFFFF', fontSize: 20, marginLeft: 5 }}>{item.Name}</Text>
                        <Text style={{ color: '#FFFFFF', fontSize: 15, marginLeft: 10 }}>Par {item.creator_name} • {item.titles.length} titres</Text>
                    </TouchableOpacity>}
                refreshing={this.state.refresh}
                onRefresh={this._Onref}
            />
        )
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
    componentDidUpdate() {
        if (this.props.navigation.state.params !== undefined && this.props.navigation.state.params.change == 1) {
            this.setState({ is_load: true })
            var user = firebase.auth().currentUser
            if (user === null) {
                this.props.navigation.navigate('Signup')
            }
            getAllPublicPlaylist(user).then((p) => {
                this.setState({ user, playlist: p, is_load: false })
            })
        }
    }
    componentDidMount() {
        this.setState({ is_load: true })
        console.log(this.props.navigation.getParam())
        var user = firebase.auth().currentUser
        if (user === null) {
            this.props.navigation.navigate('Signup')
        }
        getAllPublicPlaylist(user).then((p) => {
            this.setState({ user, playlist: p, is_load: false })
        })
    }
    render() {
        return (
            <SafeAreaView style={styles.main_container}>
                <Appbar.Header>
                    <Appbar.Content
                        title="Playlist Publique"
                    />
                </Appbar.Header>
                {this._displayPlaylist()}
                {this._displayLoading()}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#191414',

    }
})


export default Playlist