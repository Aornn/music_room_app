import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator, FlatList, Alert, TouchableOpacity } from 'react-native'
import firebase from 'react-native-firebase';
import { Appbar, Switch } from 'react-native-paper';
import DispSongsEvent from './DispSongsEvent'
import DialogInput from 'react-native-dialog-input';
import { addUserInEvent } from '../../API/addUserInEvent'
import { AddUserPlayer } from '../../API/addUserCanPlayInEvent'

import TrackPlayer from 'react-native-track-player';
import { MaterialDialog } from 'react-native-material-dialog';

class EventDetail extends React.Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('event').doc(this.props.navigation.state.params.id)
        this.event_ref = firebase.firestore().collection('vote').doc(this.props.navigation.state.params.id)
        this.sub = null
        this.check_end = TrackPlayer.addEventListener('playback-track-changed', async (data) => {
            let curID = await TrackPlayer.getCurrentTrack()
            let new_passed_song = this.state.passed_song
            index = this.state.titles.findIndex(x => x.id == curID);
            if (index > -1) {
                new_passed_song.push(this.state.titles[index])
                this.state.titles.splice(index, 1)
                this.setState({ currentTrack: curID, passed_song: new_passed_song })
            }
            else {
                this.setState({ currentTrack: curID })
            }
        });
        this.state = {
            currentTrack: undefined,
            passed_song: [],
            id: this.props.navigation.state.params.id,
            user: {},
            vote: undefined,
            owner: '',
            is_load: false,
            titles: [],
            name: '',
            creator_name: '',
            switch_state: null,
            switch_state_follow: null,
            uid: '',
            follower: [],
            accessibility: {},
            isDialogVisible: false,
            addUser: false,
            can_play: true,
        }

    }
    _order(a, b) {
        const nb1 = parseInt(a.nb_vote, 10);
        const nb2 = parseInt(b.nb_vote, 10);

        let comparison = 0;
        if (nb1 > nb2) {
            comparison = -1;
        } else if (nb1 < nb2) {
            comparison = 1;
        }
        return comparison;
    }

    _compare = (arr, vote) => {
        for(var i = 0; i < arr.length; i++)
        {
            let temp_id = arr[i].id ? arr[i].id : null 
            if(temp_id !== null)
            {
                let t_vote = vote[temp_id] ? vote[temp_id] : null
                if( t_vote !== null)
                {
                    arr[i].nb_vote = t_vote.length 
                }
                // if (t_vote.length === undefined)
                // {
                //     arr[i].nb_vote = 0
                // }
                // else
                // {
                //     arr[i].nb_vote = t_vote.length 
                // }
            }
        }
        return arr.sort(this._order)
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
    }

    onUpdate = async (snap) => {
        if (snap.exists) {
            if (snap.data().accessibility.public === false && !snap.data().follower.includes(this.state.uid)) {
                await TrackPlayer.pause()
                await TrackPlayer.removeUpcomingTracks()
                this.props.navigation.navigate('Event', { need_update: 1, id: this.state.id });
            }
            else {
                let n_titles = snap.data().titles
                let public_or_not = snap.data().accessibility.public ? true : false
                let can_play = true
                if (this.state.uid !== snap.data().owner && public_or_not == false && snap.data().can_play.length > 0 && !snap.data().can_play.includes(this.state.uid)) {
                    await TrackPlayer.reset()
                    await TrackPlayer.removeUpcomingTracks()
                    can_play = false
                }
                if (this.state.passed_song.length > 0) {
                    var new_song = [] //this.state.passed_song.filter((elem) => !snap.data().titles.includes(elem));
                    n_titles.forEach(elem => {
                        index = this.state.passed_song.findIndex(x => x.id == elem.id);
                        if (index < 0) {
                            new_song.push(elem)
                        }
                    })
                    n_titles = []
                    n_titles = new_song//this.state.titles.concat(new_song)
                }
                this.setState({
                    titles: this._compare(n_titles, this.state.vote),//this._compare(snap.data().titles, this.state.vote),
                    name: snap.data().Name,
                    creator_name: "Par " + snap.data().creator_name,
                    is_load: false,
                    owner: snap.data().owner,
                    follower: snap.data().follower,
                    accessibility: snap.data().accessibility,
                    switch_state: public_or_not,
                    can_play: can_play
                })
            }
        }
        else {
            this.props.navigation.goBack()
        }
    }
    onUpdateEvent = async (snap) => {
        if (snap.exists) {
            let new_titles = this._compare(this.state.titles, snap.data())
            if (this.state.currentTrack !== undefined) {
                await TrackPlayer.removeUpcomingTracks()
                await TrackPlayer.add({
                    id: new_titles[0].id,
                    artwork: new_titles[0].album.cover_xl,
                    url: new_titles[0].preview,
                    title: new_titles[0].title_short,
                    artist: new_titles[0].artist.name,
                    album: new_titles[0].album.title,
                })
                this.state.titles.forEach(async (elem) => {
                    if (elem.id !== new_titles[0].id) {
                        await TrackPlayer.add({
                            id: elem.id,
                            artwork: elem.album.cover_xl,
                            url: elem.preview,
                            title: elem.title_short,
                            artist: elem.artist.name,
                            album: elem.album.title,
                        })
                    }
                })
            }
            this.setState({ vote: snap.data(), titles: new_titles })
        }
    }
    async componentDidMount() {
        var user = firebase.auth().currentUser ? firebase.auth().currentUser : null //var user = firebase.auth().currentUser
        if (user === null) {
            this.props.navigation.navigate('Signup')
        }
        this.setState({ is_load: true, user, uid: user._user.uid })
        this.sub_event = this.event_ref.onSnapshot(this.onUpdateEvent)
        this.sub = this.ref.onSnapshot(this.onUpdate)
    }
    async componentWillUnmount() {
        await TrackPlayer.reset()
        this.check_end.remove()
        this.sub()
        this.sub_event()
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
                    <Appbar.Action icon="more-vert" onPress={() => {
                        if (this.state.uid === this.state.owner) {
                            this.setState({ isDialogVisible: true })
                        }
                    }} />
                </Appbar.Header>
                <MaterialDialog
                    title="Que voulez vous faire ?"
                    titleColor='#FFFFFF'
                    visible={this.state.isDialogVisible}
                    backgroundColor='rgba(0,0,0,1.0)'
                    onCancel={() => { this.setState({ isDialogVisible: false }) }}>
                    <View>
                        <TouchableOpacity onPress={() => {
                            this.setState({ addUser: true })
                        }}>
                            <DialogInput isDialogVisible={this.state.addUser}
                                title={"Ajouter utilisateur dans l'event"}
                                message={"Veuillez entrez son adresse mail : "}
                                submitInput={(inputText) => {
                                    this.setState({ isDialogVisible: false, addUser: false, is_load: true })
                                    addUserInEvent(this.state.user, this.state.id, inputText).then((response) => {
                                        this.setState({ is_load: false })
                                        Alert.alert("OK !", response._bodyText,
                                            [
                                                {
                                                    text: "OK"
                                                }
                                            ])
                                    }).catch(err => {
                                        Alert.alert("Erreur", err.message,
                                            [
                                                {
                                                    text: "OK"
                                                }
                                            ])
                                    })
                                }}
                                closeDialog={() => { this.setState({ addUser: false, isDialogVisible: false }) }}>
                            </DialogInput>
                            <Text style={{ fontSize: 25, color: '#FFFFFF', padding: 10, fontWeight: 'bold', textAlign: 'center' }}>Ajouter dans l'event</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.setState({ addUser: true })
                        }}>
                            <DialogInput isDialogVisible={this.state.addUser}
                                title={"Ajouter utilisateur dans l'event"}
                                message={"Veuillez entrez son adresse mail : "}
                                submitInput={(inputText) => {
                                    this.setState({ isDialogVisible: false, addUser: false, is_load: true })
                                    AddUserPlayer(this.state.user, this.state.id, inputText).then((response) => {
                                        this.setState({ is_load: false })
                                        Alert.alert("OK !", response._bodyText,
                                            [
                                                {
                                                    text: "OK"
                                                }
                                            ])
                                    }).catch(err => {
                                        Alert.alert("Erreur", err.message,
                                            [
                                                {
                                                    text: "OK"
                                                }
                                            ])
                                    })
                                }}
                                closeDialog={() => { this.setState({ addUser: false }) }}>
                            </DialogInput>
                            <Text style={{ fontSize: 25, color: '#FFFFFF', padding: 10, fontWeight: 'bold', textAlign: 'center' }}>Preciser qui peut jouer la musique</Text>
                        </TouchableOpacity>
                    </View>
                </MaterialDialog>
                {this._dispChangeAccess()}
                <TouchableOpacity onPress={async () => {
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
                }}>
                    <Text style={{ fontSize: 25, color: '#FFFFFF', padding: 10, fontWeight: 'bold', textAlign: 'center' }}>Lancer la lecture !</Text>
                </TouchableOpacity>
                <FlatList
                    extraData={this.state}
                    data={this.state.titles}
                    keyExtractor={(item, key) => key.toString()}
                    renderItem={({ item }) =>
                        <DispSongsEvent event={true} can_play={this.state.can_play} song={item} vote={this.state.vote} id={this.state.id} access={this.state.accessibility} owner={this.state.owner} follower={this.state.follower} uid={this.state.user._user.uid} />
                    }
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
        zIndex : 1,
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


export default EventDetail