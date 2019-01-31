import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator } from 'react-native'
import { Appbar, Searchbar } from 'react-native-paper';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            token: '',
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
    render() {
        return (
            <SafeAreaView style={styles.main_container}>
                <Appbar.Header>
                    <Appbar.BackAction
                        onPress={() => this.props.navigation.navigate('UserProfil')}
                    />
                </Appbar.Header>
                <Searchbar
                    placeholder="Search"
                />
                {this._displayLoading()}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
    }
})


export default Search