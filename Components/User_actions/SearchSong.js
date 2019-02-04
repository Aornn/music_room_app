import React from 'react'
import DispSongs from '../DispSongs'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator, FlatList } from 'react-native'
import { Appbar, Searchbar} from 'react-native-paper';
import axios from 'axios'
class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            query: '',
            res_song : [],
            is_load: false
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
    _ResearchSong () {
        axios.get('https://api.deezer.com/search/track?q='+this.state.query)
        .then(res => {
            console.log(res.data.data)
            this.setState({res_song : res.data.data})
        })
        
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
                    onChangeText={query => { this.setState({ query : query }); }}
                    onSubmitEditing={() => this._ResearchSong()}
                    style = {{backgroundColor : '#191414'}}
                />
                <FlatList
                    data={this.state.res_song}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <DispSongs song={item} />}
                />
                {this._displayLoading()}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        color : '#000000',
        backgroundColor : '#000000',
    }
})


export default Search