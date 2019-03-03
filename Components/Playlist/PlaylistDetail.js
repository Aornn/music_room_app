import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator, FlatList, Alert } from 'react-native'
import firebase from 'react-native-firebase';
import { Appbar, Switch, Button } from 'react-native-paper';
import { addUserInPlaylist } from '../../API/addUserInPlaylist'
import DispSongsPlaylist from './DispSongsPlaylist'
import TrackPlayer from 'react-native-track-player';
import DialogInput from 'react-native-dialog-input';

class PlaylistDetail extends React.Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('playlist').doc(this.props.navigation.state.params.id)
        this.sub = null
        this.state = {
            id: this.props.navigation.state.params.id,
            isDialogVisible: false,
            user: {},
            owner: '',
            is_load: false,
            titles: [],
            name: '',
            creator_name: '',
            switch_state: null,
            switch_state_follow: null,
            uid: '',
            follower: [],
            accessibility: {}
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
    _dispTitles() {
        if (this.state.titles.length > 0) {
            console.log(this.state.titles.length)
            return (
                <FlatList
                    data={this.state.titles}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) =>
                        <DispSongsPlaylist song={item} id={this.state.id} access={this.state.accessibility} owner={this.state.owner} follower={this.state.follower} uid={this.state.user._user.uid} />
                    }
                />
            )
        }
    }
    _dispChangeAccess() {
        if (this.state.uid === this.state.owner) {
            return (
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 20, padding: 5 }}>Visible par tous : </Text>
                    <Switch
                        value={this.state.switch_state}
                        onValueChange={(data) => {
                            if (data === true) {
                                this.ref.update({
                                    accessibility: {
                                        public: true
                                    }
                                })
                            }
                            else {
                                this.ref.update({
                                    accessibility: {
                                        public: false
                                    }
                                })
                            }
                            this.setState({ switch_state: data });
                        }}
                    />
                </View>
            )
        }
        else {
            return (
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 20, padding: 5 }}>S'abonner: </Text>
                    <Switch
                        value={this.state.switch_state_follow}
                        onValueChange={(data) => {
                            if (data === true && this.state.switch_state_follow === false) {
                                this.ref.update({
                                    follower: firebase.firestore.FieldValue.arrayUnion(this.state.uid)
                                })
                                this.setState({ switch_state_follow: true })
                            }
                            else if (data == false && this.state.switch_state_follow === true) {
                                this.ref.update({
                                    follower: firebase.firestore.FieldValue.arrayRemove(this.state.uid)
                                })
                                this.setState({ switch_state_follow: false })
                            }
                        }}
                    />
                </View>
            )
        }
    }
    async _PlayAll() {
        await TrackPlayer.reset()
        this.state.titles.forEach(async (res) => {
            await TrackPlayer.add({
                id: res.id,
                artwork: res.album.cover_xl,
                url: res.preview,
                title: res.title_short,
                artist: res.artist.name,
                album: res.album.title,
            });
        })
        TrackPlayer.play();
    }
    onUpdate = async (snap) => {
        var inside_follower = false
        if (snap.exists) {
            if (snap.data().accessibility.public === false && !snap.data().follower.includes(this.state.uid)) {
                console.log('plus dedans')
                await TrackPlayer.pause()     
                await TrackPlayer.removeUpcomingTracks()                
                this.props.navigation.navigate('PlaylistPriv', {need_update :  1, id : this.state.id});
            }
            else
            {
                if (this.state.switch_state_follow === null) {
                    snap.data().follower.forEach(element => {
                        if (element === this.state.uid) {
                            inside_follower = true
                        }
                    });
                    this.setState({ switch_state_follow: inside_follower })
                }
                this.setState({
                    titles: snap.data().titles, name: snap.data().Name,
                    creator_name: "Par " + snap.data().creator_name, is_load: false, owner: snap.data().owner,
                    switch_state: snap.data().accessibility.public, follower: snap.data().follower, accessibility: snap.data().accessibility
                })
            }

        }
        else {
            this.props.navigation.goBack()
        }
    }
    componentDidMount() {
        console.log('mount / id : ' + this.state.id)
        var user = firebase.auth().currentUser
        this.setState({ is_load: true })
        this.sub = this.ref.onSnapshot(this.onUpdate)
        this.setState({ user, uid: user._user.uid })

    }
    componentWillUnmount() {
        this.sub()
    }
    _addInPlaylist() {
        if (this.state.accessibility.public == true || this.state.owner == this.state.uid)
        {
            return (
                <Button style={{ margin: 5, marginTop: 5, borderRadius: 5, borderWitdh: 1, borderColor: '#FFFFFF' }} icon="done" mode="contained" onPress={() => {
                    this.setState({ isDialogVisible: true })
                }}>Inivter dans la playlist</Button>
            )
        }
    }
    render() {
        return (
            <SafeAreaView style={styles.main_container}>
                <Appbar.Header>
                    <Appbar.BackAction
                        onPress={() => {
                            this.props.navigation.goBack()
                        }}
                    />
                    <Appbar.Content
                        title={this.state.name}
                        subtitle={this.state.creator_name}
                    />
                </Appbar.Header>
                {this._dispChangeAccess()}
                <DialogInput isDialogVisible={this.state.isDialogVisible}
                    title={"Ajouter utilisateur dans la Playlist"}
                    message={"Veuillez entrez son adresse mail : "}
                    submitInput={(inputText) => {
                        this.setState({ isDialogVisible: false, is_load : true })
                        addUserInPlaylist(this.state.user, this.state.id, inputText).then((response) => {
                            this.setState({is_load : false})
                            Alert.alert("OK !", response._bodyText,
                                [
                                    {
                                        text: "OK"
                                    }
                                ])
                        }).catch(err => {
                            console.log(err)
                        })
                    }}
                    closeDialog={() => { this.setState({ isDialogVisible: false }) }}>
                </DialogInput>

                {this._addInPlaylist()}
                <Button style={{ margin: 5, marginTop: 5, borderRadius: 5, borderWitdh: 1, borderColor: '#FFFFFF' }} icon="done" mode="contained" onPress={() => this._PlayAll()}>
                    Lecture
                </Button>
                {this._dispTitles()}
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
    titre: {
        fontSize: 25,
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 20,
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


export default PlaylistDetail