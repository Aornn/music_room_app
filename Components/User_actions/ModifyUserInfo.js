import React from 'react'
import { SafeAreaView, View, StyleSheet, Text, ActivityIndicator, Button } from 'react-native'
import { Appbar,TextInput } from 'react-native-paper';

class ModifUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            is_load: false,
            new_pseudo: '',
            new_email: '',

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
    componentDidMount() {
        this.setState({ user: this.props.navigation.state.params.user })
    }
    async _updateUserInfos() {
        var change = 0;
        this.setState({ is_load: true })
        if ((this.state.new_pseudo !== this.state.user.displayName) || (this.state.new_email !== this.state.user.email)) {
            if (this.state.new_pseudo.length > 0) {
                await this.state.user.updateProfile({
                    displayName: this.state.new_pseudo
                })
                    .then(() => { change = 1 })
            }
            if (this.state.new_email.length > 0) {
                await this.state.user.updateEmail(this.state.new_email)
                    .then(() => {
                        change = 2
                    })
                    .catch((err) => {
                        console.log(err.message)
                    })
            }
            console.log("ModifyUserinfo change : " + change)
            this.props.navigation.navigate('UserProfil', { change })
        }
    }
    render() {
        return (
            <SafeAreaView style={styles.main_container}>
                <Appbar.Header>
                    <Appbar.BackAction
                        onPress={() => this.props.navigation.navigate('UserProfil')} // peut etre ajouter { change: 1 }
                    />
                    <Appbar.Content
                        title="Modifier Compte"
                    />
                </Appbar.Header>
                <TextInput
                    placeholder={this.state.user.displayName}
                    onChangeText={(new_pseudo) => { this.setState({ new_pseudo }) }}
                />
                <TextInput
                    placeholder={this.state.user.email}
                    onChangeText={(new_email) => { this.setState({ new_email }) }}

                />
                <Text>Attention modifier votre adresse mail vous deconnectera</Text>
                <Button
                    title='Mettre à jour mes infos'
                    onPress={() => this._updateUserInfos()}
                />
                {this._displayLoading()}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor : '#191414',
    },
    loading_container: {
        position: 'absolute',
        backgroundColor : '#191414',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})


export default ModifUser