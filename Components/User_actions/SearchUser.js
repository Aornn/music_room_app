import React from 'react'
import DispUsers from '../UserSearch/DispUsers'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator, FlatList } from 'react-native'
import { Searchbar } from 'react-native-paper';
import firebase from 'react-native-firebase';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            query: '',
            res_user: [],
            is_load: false,
            uid: '',
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
    async _ResearchUser() {
        if (this.state.query.length > 0) {
            let user_arr = [];
            let res = await firebase.firestore().collection('users').where('displayName', '==', this.state.query).get()
            res.forEach(elem => {
                if (elem.data().accessibility.public === true || elem.data().friends.includes(this.state.uid)) {
                    elem.data().id = elem.id
                    user_arr.push(elem.data())
                }
            })
            this.setState({ res_user: user_arr })
        }
    }

    componentDidMount() {
        var user = firebase.auth().currentUser
        if (user === null) {
            this.props.navigation.navigate('Signup')
        }
        this.setState({ user: user, uid: user._user.uid })
    }

    render() {
        return (
            <SafeAreaView style={styles.main_container}>
                {/* <Appbar.Header>
                    <Appbar.BackAction
                        onPress={() => this.props.navigation.navigate('UserProfil')}
                    />
                </Appbar.Header> */}
                <Searchbar
                    placeholder='Search'
                    placeholderTextColor='#FFFFFF'
                    onChangeText={query => { this.setState({ query: query }); }}
                    onSubmitEditing={() => this._ResearchUser()}
                    style={{ backgroundColor: 'rgb(68,67,69)', borderRadius: 5, margin: 5 }}
                />
                <FlatList
                    data={this.state.res_user}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <DispUsers user={item} nav={this.props.navigation} />}
                />
                {this._displayLoading()}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        color: '#000000',
        backgroundColor: '#000000',
    }
})


export default Search