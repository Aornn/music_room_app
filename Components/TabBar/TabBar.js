import React, { Component } from 'react';
import { SafeAreaView, View, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Text } from 'react-native'
import Player from '../Player'
import TrackPlayer from 'react-native-track-player';

export class TabBar extends Component {

    render() {
        return (
            <View style={{ backgroundColor: 'rgb(18,18,18)' }}>
                <Player />
                <View style={styles.main_container}>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Home') }}><Text style={styles.text}>Accueil</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Event') }}><Text style={styles.text}>Evénement</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Playlist') }}><Text style={styles.text}>Playlist</Text></TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        color: '#FFFFFF',
        backgroundColor: 'rgb(31,32,35)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        // textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        color: '#FFFFFF',
        fontSize: 20,
    },
})
