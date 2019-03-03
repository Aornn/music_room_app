import React from 'react'
import DispSongsSearch from './DispSongsSearch'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator, FlatList } from 'react-native'
import { Appbar, Searchbar } from 'react-native-paper';
import axios from 'axios'

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            query: '',
            res_song: [],
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
    _ResearchReq() {
        if (this.state.query.length > 0) {
            axios.all([axios.get('https://api.deezer.com/search/track?q=' + this.state.query),
            axios.get('https://api.deezer.com/search/artist?q=' + this.state.query)])
                .then(axios.spread((songReq, artistReq) => {
                    res = artistReq.data.data.slice(0, 3)
                    res = res.concat(songReq.data.data)
                    this.setState({ res_song: res })
                }))
        }
    }
    // componentDidMount()
    // {
    //     var user = firebase.auth().currentUser
    //     if (user === null) {
    //         this.props.navigation.navigate('Signup')
    //     }
    //     this.setState({uid: user._user.uid})
    // }
    render() {
        return (
            <SafeAreaView style={styles.main_container}>
                <Appbar.Header>
                    <Appbar.BackAction
                        onPress={() => this.props.navigation.navigate('UserProfil')}
                    />
                </Appbar.Header>
                <Searchbar
                    placeholder='Search'
                    placeholderTextColor='#FFFFFF'
                    onChangeText={query => { this.setState({ query: query }); }}
                    onSubmitEditing={() => this._ResearchReq()}
                    style={{ backgroundColor: 'rgb(68,67,69)', borderRadius: 5, margin: 5 }}
                />
                <FlatList
                    data={this.state.res_song}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <DispSongsSearch song={item} nav={this.props.navigation}/>}
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