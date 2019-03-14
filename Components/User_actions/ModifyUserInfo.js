import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator, Alert, TouchableOpacity, ScrollView } from 'react-native'
import { Appbar, TextInput, Checkbox, Button, Switch } from 'react-native-paper';
import firebase from 'react-native-firebase';
import { GoogleSignin } from 'react-native-google-signin';

class ModifUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            res: [],
            is_link: true,
            friends_name: '',
            user: {},
            public_priv_friends: true,
            public_priv_public: true,
            is_load: true,
            new_pseudo: '',
            new_email: '',
            jazz: false,
            electro: false,
            classique: false,
            pop: false,
            hip_hop: false,
            rock: false,
            chill: false,
            ambiance: false,
            latino: false,
            affro: false,
            rnb: false,
            rap: false,
        }

    }
    async _LinkGoogle() {
        await GoogleSignin.configure();
        var data = undefined
        try {
            data = await GoogleSignin.signIn();
        } catch{ }
        if (data !== undefined) {
            const credential = await firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
            const user = await firebase.auth().currentUser
            if (user === null) {
                this.props.navigation.navigate('Login')
            }
            user.linkWithCredential(credential)
                .then(async (res) => {
                    await firebase.firestore().collection('users').doc(user._user.uid).update({
                        is_linked_to_google: true
                    })

                })
                .catch(async err => {
                    try {
                        await GoogleSignin.revokeAccess();
                        await GoogleSignin.signOut();
                    }
                    catch{ }
                    Alert.alert("OUPS", err.message,
                        [
                            {
                                text: "OK"
                            }
                        ])
                })
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
    _displayDeezerButton() {
        if (this.state.is_link === false) {
            return (
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate('AuthDezzer')}
                    underlayColor='#fff'>
                    <Text style={styles.inscription_but}>Associer à deezer</Text>
                </TouchableOpacity>
            )
        }
        else {
            return (
                <TouchableOpacity
                    style={styles.button}
                    onPress={async () => {
                        await firebase.firestore().collection('users').doc(this.props.navigation.state.params.user.uid).update({
                            is_linked_to_deezer: false
                        })
                        this.setState({ is_link: false })
                    }}
                    underlayColor='#fff'>
                    <Text style={styles.inscription_but}>Dissocier de deezer</Text>
                </TouchableOpacity>
            )
        }
    }
    async componentDidMount() {
        let resu = await firebase.firestore().collection('users').doc(this.props.navigation.state.params.user.uid).get()
        pref_music = resu.data().pref_music
        public_priv_friends = resu.data().accessibility.friends ? true : false
        public_priv_public = resu.data().accessibility.public ? true : false
        is_link = resu.data().is_linked_to_deezer ? true : false
        pref_music.forEach(element => {
            this.setState({ [element]: true })
        });
        this.setState({ user: this.props.navigation.state.params.user, res: pref_music, is_load: false, is_link, public_priv_friends, public_priv_public })

    }
    async _updateUserInfos() {
        var change = 0;
        this.setState({ is_load: true })
        if ((this.state.new_pseudo !== this.state.user.displayName)) {
            if (this.state.new_pseudo.length > 0) {
                await this.state.user.updateProfile({
                    displayName: this.state.new_pseudo
                })
                    .then(() => { change = 1 })
            }
        }
        await firebase.firestore().collection('users').doc(this.props.navigation.state.params.user.uid).update({
            pref_music: this.state.res,
            accessibility: {
                public: this.state.public_priv_public,
                friends: this.state.public_priv_friends,
            }
        })
        this.props.navigation.navigate('UserProfil', { change })
    }
    render() {
        const { displayName } = this.state
        return (
            <SafeAreaView style={styles.main_container}>
                <ScrollView>
                    <Appbar.Header>
                        <Appbar.BackAction
                            onPress={() => this.props.navigation.navigate('UserProfil')}
                        />
                        <Appbar.Content
                            title="Modifier Compte"
                        />
                    </Appbar.Header>
                    <Text style={styles.titre}>Changer de Pseudo : </Text>
                    <TextInput
                        mode='flat'
                        theme={{ colors: { background: '#FFFFFF', primary: '#FFFFFF' } }}
                        label="Pseudo"
                        value={displayName}
                        style={styles.textInput}
                        onChangeText={(text) => {
                            this.setState({ displayName: text, error: false })
                        }} />
                    <View style={{ flexDirection: 'row' }}>

                        <Text style={{ color: '#FFFFFF', fontSize: 20, padding: 5 }}>Rendre votre profil visible à vos amis : </Text>

                        <Switch
                            value={this.state.public_priv_friends}
                            onValueChange={(data) => {
                                if (data === true) {
                                    this.setState({ public_priv_friends: true });

                                }
                                else {
                                    this.setState({ public_priv_friends: false, public_priv_public: false });
                                }
                            }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row' }}>

                        <Text style={{ color: '#FFFFFF', fontSize: 20, padding: 5 }}>Rendre votre profil visible à tous : </Text>

                        <Switch
                            value={this.state.public_priv_public}
                            onValueChange={(data) => {
                                if (data === true) {
                                    this.setState({ public_priv_public: true, public_priv_friends: true });

                                }
                                else {
                                    this.setState({ public_priv_public: false });
                                }
                            }}
                        />
                    </View>
                    <Text style={styles.titre}>Mes Préférences musicales : </Text>
                    <View style={{
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={styles.text}>Jazz</Text>
                        <Checkbox
                            status={this.state.jazz ? 'checked' : 'unchecked'}
                            onPress={() => {
                                if (this.state.jazz) {

                                    const index = this.state.res.indexOf('jazz')
                                    this.state.res.splice(index, 1)
                                }
                                else {
                                    this.state.res.push('jazz')
                                }
                                this.setState({ jazz: !this.state.jazz });
                            }}
                        />
                        <Text style={styles.text}>Electro</Text><Checkbox
                            status={this.state.electro ? 'checked' : 'unchecked'}
                            onPress={() => {
                                if (this.state.electro) {

                                    const index = this.state.res.indexOf('electro')
                                    this.state.res.splice(index, 1)
                                }
                                else {
                                    this.state.res.push('electro')
                                } this.setState({ electro: !this.state.electro });
                            }}
                        />
                        <Text style={styles.text}>Classique</Text><Checkbox
                            status={this.state.classique ? 'checked' : 'unchecked'}
                            onPress={() => {
                                if (this.state.classique) {

                                    const index = this.state.res.indexOf('classique')
                                    this.state.res.splice(index, 1)
                                }
                                else {
                                    this.state.res.push('classique')
                                } this.setState({ classique: !this.state.classique });
                            }}
                        />
                        <Text style={styles.text}>Pop</Text><Checkbox
                            status={this.state.pop ? 'checked' : 'unchecked'}
                            onPress={() => {
                                if (this.state.pop) {

                                    const index = this.state.res.indexOf('pop')
                                    this.state.res.splice(index, 1)
                                }
                                else {
                                    this.state.res.push('pop')
                                } this.setState({ pop: !this.state.pop });
                            }}
                        />
                        <Text style={styles.text}>Hip-Hop</Text><Checkbox
                            status={this.state.hip_hop ? 'checked' : 'unchecked'}
                            onPress={() => {
                                if (this.state.hip_hop) {

                                    const index = this.state.res.indexOf('hip_hop')
                                    this.state.res.splice(index, 1)
                                }
                                else {
                                    this.state.res.push('hip_hop')
                                } this.setState({ hip_hop: !this.state.hip_hop });
                            }}
                        />
                        <Text style={styles.text}>Rock</Text><Checkbox
                            status={this.state.rock ? 'checked' : 'unchecked'}
                            onPress={() => {
                                if (this.state.rock) {

                                    const index = this.state.res.indexOf('rock')
                                    this.state.res.splice(index, 1)
                                }
                                else {
                                    this.state.res.push('rock')
                                } this.setState({ rock: !this.state.rock });
                            }}
                        />
                        <Text style={styles.text}>Chill</Text><Checkbox
                            status={this.state.chill ? 'checked' : 'unchecked'}
                            onPress={() => {
                                if (this.state.chill) {

                                    const index = this.state.res.indexOf('chill')
                                    this.state.res.splice(index, 1)
                                }
                                else {
                                    this.state.res.push('chill')
                                } this.setState({ chill: !this.state.chill });
                            }}
                        />
                        <Text style={styles.text}>Ambiance</Text><Checkbox
                            status={this.state.ambiance ? 'checked' : 'unchecked'}
                            onPress={() => {
                                if (this.state.ambiance) {

                                    const index = this.state.res.indexOf('ambiance')
                                    this.state.res.splice(index, 1)
                                }
                                else {
                                    this.state.res.push('ambiance')
                                } this.setState({ ambiance: !this.state.ambiance });
                            }}
                        />
                        <Text style={styles.text}>Latino</Text><Checkbox
                            status={this.state.latino ? 'checked' : 'unchecked'}
                            onPress={() => {
                                if (this.state.latino) {

                                    const index = this.state.res.indexOf('latino')
                                    this.state.res.splice(index, 1)
                                }
                                else {
                                    this.state.res.push('latino')
                                } this.setState({ latino: !this.state.latino });
                            }}
                        />
                        <Text style={styles.text}>Affro</Text><Checkbox
                            status={this.state.affro ? 'checked' : 'unchecked'}
                            onPress={() => {
                                if (this.state.affro) {

                                    const index = this.state.res.indexOf('affro')
                                    this.state.res.splice(index, 1)
                                }
                                else {
                                    this.state.res.push('affro')
                                } this.setState({ affro: !this.state.affro });
                            }}
                        />
                        <Text style={styles.text}>RnB</Text><Checkbox
                            status={this.state.rnb ? 'checked' : 'unchecked'}
                            onPress={() => {
                                if (this.state.rnb) {

                                    const index = this.state.res.indexOf('rnb')
                                    this.state.res.splice(index, 1)
                                }
                                else {
                                    this.state.res.push('rnb')
                                } this.setState({ rnb: !this.state.rnb });
                            }}
                        />
                        <Text style={styles.text}>Rap</Text><Checkbox
                            status={this.state.rap ? 'checked' : 'unchecked'}
                            onPress={() => {
                                if (this.state.rap) {

                                    const index = this.state.res.indexOf('rap')
                                    this.state.res.splice(index, 1)
                                }
                                else {
                                    this.state.res.push('rap')
                                } this.setState({ rap: !this.state.rap });
                            }}
                        />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        {this._displayDeezerButton()}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => this._LinkGoogle()}
                            underlayColor='#fff'>
                            <Text style={styles.inscription_but}>Associer Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => this._updateUserInfos()}
                            underlayColor='#fff'>
                            <Text style={styles.inscription_but}>Valider</Text>
                        </TouchableOpacity>
                    </View>
                    {this._displayLoading()}
                </ScrollView>
            </SafeAreaView >
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#191414',
    },
    loading_container: {
        zIndex: 1,
        position: 'absolute',
        backgroundColor: '#191414',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        margin: 5,
        borderRadius: 5,
        backgroundColor: '#191414',
        borderWidth: 1,
        borderColor: '#FFFFFF'

    },
    titre: {
        padding: 5,
        color: '#FFFFFF',
        fontSize: 20,
    },
    text: {
        paddingTop: 5,
        color: '#FFFFFF',
        fontSize: 15,
    },
    button: {
        height: 50,
        width: 300,
        marginTop: 20,
        backgroundColor: '#191414',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: 5,
    },
    inscription_but: {
        color: "#FFFFFF",
        textAlign: 'center',
        fontSize: 18
    }
})


export default ModifUser