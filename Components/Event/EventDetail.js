import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator, FlatList } from 'react-native'
import firebase from 'react-native-firebase';
import { Appbar, Switch } from 'react-native-paper';
import DispSongs from '../DispSongs'

class EventDetail extends React.Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('event').doc(this.props.navigation.state.params.id)
        this.sub = null
        this.state = {
            id: this.props.navigation.state.params.id,
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
                        <Text>{item.title_short}</Text>
                    }
                />
            )
        }
    }

    onUpdate = (snap) => {
        if (snap.exists) {
            this.setState({
                titles: snap.data().titles, name: snap.data().Name,
                creator_name: "Par " + snap.data().creator_name, is_load: false, owner: snap.data().owner, follower: snap.data().follower,
                accessibility: snap.data().accessibility
            })
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


export default EventDetail