import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator, FlatList } from 'react-native'
import firebase from 'react-native-firebase';
import { Appbar, Switch } from 'react-native-paper';
import DispSongsEvent from './DispSongsEvent'
import DialogInput from 'react-native-dialog-input';
import { addUserInEvent } from '../../API/addUserInEvent'
import TrackPlayer from 'react-native-track-player';

class EventDetail extends React.Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('event').doc(this.props.navigation.state.params.id)
        this.event_ref = firebase.firestore().collection('vote').doc(this.props.navigation.state.params.id)
        this.sub = null
        this.state = {
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
        for (var key in arr) {
            if (arr[key] !== undefined && vote[arr[key].id] !== undefined) {
                arr[key].nb_vote = vote[arr[key].id].length
            }
            else {
                arr[key].nb_vote = 0
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
                console.log('plus dedans')
                await TrackPlayer.pause()     
                await TrackPlayer.removeUpcomingTracks()           
                this.props.navigation.navigate('Event', {need_update :  1, id : this.state.id});
            }
            else {
                this.setState({
                    titles: this._compare(snap.data().titles, this.state.vote),
                    name: snap.data().Name,
                    creator_name: "Par " + snap.data().creator_name,
                    is_load: false,
                    owner: snap.data().owner,
                    follower: snap.data().follower,
                    accessibility: snap.data().accessibility
                })
            }
        }
        else {
            this.props.navigation.goBack()
        }
    }
    onUpdateEvent = (snap) => {
        if (snap.exists) {
            this.setState({ vote: snap.data(), titles: this._compare(this.state.titles, snap.data()) })
        }
    }
    componentDidMount() {
        var user = firebase.auth().currentUser
        this.setState({ is_load: true })
        this.sub_event = this.event_ref.onSnapshot(this.onUpdateEvent)
        this.sub = this.ref.onSnapshot(this.onUpdate)
        this.setState({ user, uid: user._user.uid })

    }
    componentWillUnmount() {
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
                <DialogInput isDialogVisible={this.state.isDialogVisible}
                    title={"Ajouter utilisateur dans l'event"}
                    message={"Veuillez entrez son adresse mail : "}
                    submitInput={(inputText) => {
                        this.setState({ isDialogVisible: false, is_load: true })
                        addUserInEvent(this.state.user, this.state.id, inputText).then((response) => {
                            this.setState({ is_load: false })
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
                {this._dispChangeAccess()}
                <FlatList
                    extraData={this.state}
                    data={this.state.titles}
                    keyExtractor={(item, key) => key.toString()}
                    renderItem={({ item }) =>
                        <DispSongsEvent event={true} song={item} vote={this.state.vote} id={this.state.id} access={this.state.accessibility} owner={this.state.owner} follower={this.state.follower} uid={this.state.user._user.uid} />
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