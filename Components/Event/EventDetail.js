import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator, FlatList } from 'react-native'
import firebase from 'react-native-firebase';
import { Appbar } from 'react-native-paper';
import DispSongs from '../DispSongs'

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
            accessibility: {}
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
            if(vote[arr[key].id] !== undefined)
            {
                arr[key].nb_vote = vote[arr[key].id].length
            }
            else
            {
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
    onUpdate = (snap) => {
        if (snap.exists) {
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
        else {
            this.props.navigation.goBack()
        }
    }
    onUpdateEvent = (snap) => {
        if (snap.exists) {
            this.setState({ vote: snap.data(), titles : this._compare(this.state.titles, snap.data())})
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
                    <Appbar.Action icon="more-vert" onPress={this._onMore} />
                </Appbar.Header>
                <FlatList
                    extraData={this.state}
                    data={this.state.titles}
                    keyExtractor={(item, key) => key.toString()}
                    renderItem={({ item }) =>
                        <DispSongs event={true} song={item} vote={this.state.vote} id={this.state.id} access={this.state.accessibility} owner={this.state.owner} follower={this.state.follower} uid={this.state.user._user.uid} />
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