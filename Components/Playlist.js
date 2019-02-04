import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator, FlatList } from 'react-native'
import { getAllPublicPlaylist } from '../API/getAllPublicPlaylist'
import firebase from 'react-native-firebase';
import { List} from 'react-native-paper';
import { Appbar } from 'react-native-paper';

class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            token: '',
            playlist: [],
            refresh : false, 
            is_load: false
        }

    }

    _Onref = () => {
        console.log("onref")
        this.setState({refresh : true})
        var user = firebase.auth().currentUser
        if (user === null) {
            this.props.navigation.navigate('Signup')
        }
        getAllPublicPlaylist(user).then((p) => {
            this.setState({ user, playlist: p, refresh : false })
        })
    }

    _displayPlaylist() {
        if (this.state.playlist.length > 0) {
            // console.log(this.state.playlist)
            return (
                <FlatList
                    data={this.state.playlist}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <List.Item
                        title={item.Name}
                        description={item.genre}
                        left={props => <List.Icon {...props} icon="library-music" />}
                        onPress={() => {
                            let id = item.id
                            this.props.navigation.navigate('PlaylistDetailPub', { id}) 
                        }}
                    />}
                    refreshing={this.state.refresh}
                    onRefresh={this._Onref}
                />
            )
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
    componentDidUpdate()
    {
        if(this.props.navigation.state.params !== undefined && this.props.navigation.state.params.change == 1)
        {
            this.setState({is_load : true})
            var user = firebase.auth().currentUser
            if (user === null) {
                this.props.navigation.navigate('Signup')
            }
            getAllPublicPlaylist(user).then((p) => {
                this.setState({ user, playlist: p, is_load:false })
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
                <Text>Playlist </Text>
                {this._displayPlaylist()}
                {this._displayLoading()}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor : '#191414',

    }
})


export default Playlist