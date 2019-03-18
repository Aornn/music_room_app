import React from 'react'
import { View, StyleSheet, Text, Image } from 'react-native'
import TrackPlayer, { ProgressComponent, STATE_PLAYING, STATE_PAUSED, STATE_STOPPED } from 'react-native-track-player';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Foundation from 'react-native-vector-icons/Foundation'

class ProgressBar extends ProgressComponent {
    render() {
        return (
            <View style={styles.progress}>
                <View style={{ flex: this.getProgress(), backgroundColor: 'white' }} />
                <View style={{ flex: 1 - this.getProgress(), backgroundColor: 'grey' }} />
            </View>
        );
    }
}

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.track_ch = TrackPlayer.addEventListener('playback-track-changed', async (data) => {
            let track = await TrackPlayer.getTrack(data.nextTrack);
            let player_state = await TrackPlayer.getState()
            if (track !== null) {
                this.setState({ track, player_state, visible: true });
            }
        });
        this.play_ch = TrackPlayer.addEventListener('playback-state', async (data) => {
            if (data.state == STATE_PAUSED) {
                this.setState({ pause: false })
            }
            if (data.state == STATE_PLAYING) {
                this.setState({ pause: true })
            }
        });
        this.state = {
            track: '',
            id: '',
            next_track: undefined,
            player_state: '',
            visible: true,
            pause: false,
        }

    }

    async componentDidMount() {
        await TrackPlayer.setupPlayer()
        await TrackPlayer.updateOptions({
            stopWithApp: true
        });
    }
    async componentWillUnmount() {
        this.track_ch.remove()
        this.play_ch.remove()
        await TrackPlayer.reset()
        await TrackPlayer.destroy()
    }
    render() {
        return (
            <View style={{ height: 70, backgroundColor: 'rgb(18,18,18)', padding: 5, flexDirection: 'row' }}>
                <Image
                    style={{ width: 50, height: 50, paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10 }}
                    source={{ uri: this.state.track.artwork }}
                />
                <View style={{ flex: 2, flexWrap: 'nowrap', paddingLeft: 5, alignItems: 'center' }}>
                    <Text numberOfLines={1} style={{ color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold', fontSize: 20, }}>{this.state.track.title}</Text>
                    <Text numberOfLines={1} style={{ color: '#FFFFFF', }}>{this.state.track.artist}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Foundation name='previous' style={{ padding: 5, }} size={30} color="white" onPress={async () => {
                        try {
                            await TrackPlayer.skipToPrevious()
                        }
                        catch
                        { }
                    }} />

                    {this.state.visible && !this.state.pause &&
                        <AntDesign name='play' style={{ padding: 5 }} size={30} color="white" onPress={() => {
                            TrackPlayer.play()
                            // this.setState({ pause: true })
                        }} />
                    }
                    {this.state.visible && this.state.pause &&
                        <AntDesign name='pausecircleo' style={{ padding: 5 }} size={30} color="white" onPress={async () => {
                            if (await TrackPlayer.getState() === STATE_PLAYING) {
                                TrackPlayer.pause()
                                // this.setState({ pause: false })
                            }
                        }} />
                    }
                    <Foundation name='next' style={{ padding: 5 }} size={30} color="white" onPress={async () => {
                        try {
                            await TrackPlayer.skipToNext()
                        }
                        catch
                        { }
                    }} />
                </View>
                <ProgressBar />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    progress: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 2,
        width: '100%',
        flexDirection: 'row'
    }
})


export default Player