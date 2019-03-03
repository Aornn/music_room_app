import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native'
import { getAllPublicPlaylist } from '../../API/getAllPublicPlaylist'
import firebase from 'react-native-firebase';
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
        this.setState({ refresh: true, is_load : true })
        var user = firebase.auth().currentUser
        if (user === null) {
            this.props.navigation.navigate('Signup')
        }
        getAllPublicPlaylist(user).then((p) => {
            this.setState({ user, playlist: p, refresh: false, is_load : false })
        })
    }

    _displayPlaylist() {
        return (
            <FlatList
                data={this.state.playlist}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) =>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgb(18,18,18)', padding: 5, marginBottom: 5 }} onPress={() => {
                        this.props.navigation.navigate('PlaylistDetail', { id : item.id })
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
    componentDidMount() {
        // TrackPlayer.add({
        //     id: 'trackId',
        //     url: 'https://cdns-preview-8.dzcdn.net/stream/c-8ad574e54c315bd9f89ba34deb2c7650-4.mp3',
        //     title: 'EMIEN',
        //     artist: 'deadmau5',
        //     album: 'while(1<2)',
        //     genre: 'Progressive House, Electro House',
        //     date: '2014-05-20T07:00:00+00:00',
        // });
        this.setState({ is_load: true })
        // console.log(this.props.navigation.getParam())
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
                {/* <TouchableOpacity onPress={()=>{TrackPlayer.skipToNext()}}><Text style={{color:'#FFFFFF'}}r>NEXT</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>{TrackPlayer.skipToPrevious()}}><Text style={{color:'#FFFFFF'}}r>PREV</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>{TrackPlayer.pause()}}><Text style={{color:'#FFFFFF'}}r>PAUSE</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>{TrackPlayer.play()}}><Text style={{color:'#FFFFFF'}}r>PLAY</Text></TouchableOpacity>
 */}

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


export default Playlist