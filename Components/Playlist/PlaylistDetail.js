import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator } from 'react-native'
import firebase from 'react-native-firebase';
import { Appbar } from 'react-native-paper';

class PlaylistDetail extends React.Component {
    constructor(props) {
        super(props);
        // this.unsubscribe = null;
        this.state = {
            id: this.props.navigation.state.params.id,
            // ref : firebase.firestore().collection('playlist').doc(id),
            user: {},
            is_load: false,
            titles: [],
            name: '',
            creator_name: '',
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
            return (
                this.state.titles.map((elem, key) => <Text key={key}>{elem}</Text>)
            )
        }
    }
    componentWillUnmount() {
        this.setState({ titles: [], name: '', creator_name: '' })
        console.log("unmount")
    }
    componentDidUpdate() {
        if (this.state.id !== this.props.navigation.state.params.id) {
            console.log("UP")
            var user = firebase.auth().currentUser
            firebase.firestore().collection('playlist').doc(this.props.navigation.state.params.id).onSnapshot((snap) => {
                this.setState({ id: this.props.navigation.state.params.id, titles: snap.data().titles, name: snap.data().Name, creator_name: "Par " + snap.data().creator_name, user: user, is_load: false })
            })
        }
    }
    componentDidMount() {
        console.log("id : " + this.state.id)
        var user = firebase.auth().currentUser
        firebase.firestore().collection('playlist').doc(this.state.id).onSnapshot((snap) => {
            this.setState({ titles: snap.data().titles, name: snap.data().Name, creator_name: "Par " + snap.data().creator_name, user: user, is_load: false })

        })

    }
    render() {
        return (
            <SafeAreaView style={styles.main_container}>
                <Appbar.Header>
                    <Appbar.BackAction
                        onPress={() => this.props.navigation.navigate('UserProfil', { change: 1 })}
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
    },
    titre: {
        fontSize: 25,
        textAlign: 'center',
        color: "#000000",
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 20,
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
    }
})


export default PlaylistDetail