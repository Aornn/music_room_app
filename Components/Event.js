import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator} from 'react-native'

class Event extends React.Component {
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
                <Text>Event </Text>
                {this._displayLoading()}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        marginTop: 20,
    }
})


export default Event