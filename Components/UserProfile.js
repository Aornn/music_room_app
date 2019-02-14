import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native'
import firebase from 'react-native-firebase';
import { deleteMe } from './User_actions/DeleteMe'
import { Appbar } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import TrackPlayer from 'react-native-track-player';

class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            is_load: false,
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
    async componentDidMount() {
        // TrackPlayer.setupPlayer().then(async () => {

        //     // Adds a track to the queue
        //     await TrackPlayer.add({
        //         id: 'trackId',
        //         url: 'https://cdns-preview-d.dzcdn.net/stream/c-deda7fa9316d9e9e880d2c6207e92260-5.mp3',
        //         title: 'Avaritia',
        //         artist: 'deadmau5',
        //         album: 'while(1<2)',
        //         genre: 'Progressive House, Electro House',
        //         date: '2014-05-20T07:00:00+00:00',
        //     });
        //     // Starts playing it
        //     TrackPlayer.play();
        // });
        this.setState({ is_load: true })
        var user = firebase.auth().currentUser
        if (user === null) {
            this.props.navigation.navigate('Signup')
        }

        this.setState({ user, is_load: false })

    }
    componentDidUpdate() {
        if (this.props.navigation.state.params !== undefined && this.props.navigation.state.params.change > 0) {
            this.props.navigation.state.params.change = 0
            var new_user = firebase.auth().currentUser
            this.setState({ new_user, is_load: false })
        }

    }
    render() {
        return (

            <SafeAreaView style={styles.main_container}>
                <Appbar.Header>
                    <Appbar.Content
                        title="Music Room 42"
                    />
                </Appbar.Header>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Search', { user: this.state.user })}
                    underlayColor='#fff'
                    style={styles.button}>
                    <Feather style={styles.icon} name='search' size={30} color="white" />
                    <Text style={styles.txt_btn}>Chercher musiques</Text>

                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('UserPlaylist')}
                    underlayColor='#fff'
                    style={styles.button}>
                    <Feather style={styles.icon} name='music' size={30} color="white" />
                    <Text style={styles.txt_btn}>Mes playlists</Text>

                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('CreatePlaylist', { user: this.state.user })}
                    underlayColor='#fff'
                    style={styles.button}>
                    <Ionicons style={styles.icon} name='md-create' size={30} color="white" />
                    <Text style={styles.txt_btn}>Créer playlist</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('UserInfo', { user: this.state.user })}
                    underlayColor='#fff'
                    style={styles.button}>
                    <Ionicons style={styles.icon} name='md-options' size={30} color="white" />
                    <Text style={styles.txt_btn}>Détail du compte</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        firebase.auth().signOut().then(() => {
                            this.props.navigation.navigate('Login')
                        })
                    }}
                    underlayColor='#fff'
                    style={styles.button}>
                    <SimpleLineIcons style={styles.icon} name='logout' size={30} color="white" />
                    <Text style={styles.txt_btn}>Déconnexion</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => deleteMe(this.state.user)}
                    underlayColor='#fff'
                    style={styles.button}>
                    <AntDesign style={styles.icon} name='deleteuser' size={30} color="white" />
                    <Text style={styles.txt_btn}>Supprimer son compte</Text>
                </TouchableOpacity>
                {this._displayLoading()}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    main_container: {
        flex: 1,
        backgroundColor: '#191414',

    },
    manage: {
        alignItems: 'center',
        flexDirection: 'row',
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
    },
    txt_btn: {
        paddingLeft: 20,
        color: "#FFFFFF",
        fontSize: 20,
    },
    button: {
        flexDirection: 'row',
        // backgroundColor : '#FF0000',
        height: 30,
        marginRight: 2,
        marginLeft: 2,
        marginTop: 20,
        borderRadius: 5,

    }
})


export default UserProfile