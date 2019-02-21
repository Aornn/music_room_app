import React from 'react'
import { SafeAreaView, View, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { Appbar, TextInput, Button } from 'react-native-paper';
import { Dropdown } from 'react-native-material-dropdown';
import DateTimePicker from 'react-native-modal-datetime-picker';

class CreateEvent extends React.Component {
    constructor(props) {
        super(props);
        this.style_song = [{ value: 'jazz', }, { value: 'electro', }, { value: 'classique', }, { value: 'pop', }, { value: 'hip-hop', }, { value: 'rock', }, { value: 'chill', }, { value: 'ambiance', }, { value: 'latino', }, { value: 'affro', }, { value: 'rnb', }, { value: 'rap', }];
        this.state = {
            user: {},
            is_load: true,
            isDateTimePickerVisible: false,
            titre: '',
            lon: undefined,
            lat: undefined,
            end: undefined,
            genre: 'jazz',
        }

    }
    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
    _handleDatePicked = (date) => {
        date = new Date(date)
        console.log(date)
        month = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1)
        minute = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
        hours = (date.getHours() < 10 ? '0' : '') + date.getHours()
        day = (date.getDate() < 10 ? '0' : '') + date.getDate()
        date = date.getFullYear() + '-' + month + '-' + day + 'T' + hours + ':' + minute + ':00'
        console.log(date)
        date = Date.parse(date) / 1000
        console.log('date 2 : ')
        console.log(date)
        this.setState({ end: date })
        this._hideDateTimePicker();
    }
    _getToken(user) {
        return user.getIdToken().then((token) => {
            return token
        })
    }

    async _CreateEvent() {
        if (this.state.titre.length < 1 || this.state.end === undefined) {
            Alert.alert("OUPS", "Veuillez renseigner un titre",
                [
                    {
                        text: "OK"
                    }
                ],
                { cancelable: false })
        }
        else {
            this.setState({ is_load: true })
            // {"Name" : "event1", "genre" : "techno", "start":1547034054, "end":1554810054, "lon":48.753388300000005, "lat":2.2069669999999997, "distance":50}
            var token = await this._getToken(this.props.navigation.state.params.user)
            console.log("Name : " + this.state.titre,
                "genre : " + this.state.genre,
                "start : " + this.state.start,
                "end : " + this.state.end,
                "lon : " + this.state.lon,
                "lat : " + this.state.lat)
            let config = {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "Name": this.state.titre,
                    "genre": this.state.genre,
                    "start": this.state.start,
                    "end": this.state.end,
                    "lon": this.state.lon,
                    "lat": this.state.lat,
                    "distance": 10
                }),
                method: 'POST'
            }
            fetch('https://us-central1-music-room-42.cloudfunctions.net/createEvent', config).then(() => {
                this.props.navigation.goBack()
            })
        }

    }
    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(position)
                var timestamp = Math.floor(Date.now() / 1000)
                this.setState({ is_load : false, user: this.props.navigation.state.params.user, start: timestamp, lon: position.coords.longitude, lat: position.coords.latitude })
            },
            (error) => { 
                console.log(error.message)
                this.props.navigation.goBack()
                // this.setState({is_load : false})
            },
            { enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
        )

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
                        onPress={() => this.props.navigation.goBack()} // peut etre ajouter { change: 1 }
                    />
                    <Appbar.Content
                        title="Creer Event"
                    />
                </Appbar.Header>
                <TextInput
                    mode='flat'
                    label="Nom de l'event"
                    theme={{ colors: { background: '#FFFFFF', primary: '#FFFFFF' } }}
                    value={this.state.titre}
                    style={styles.textInput}
                    onChangeText={(titre) => {
                        this.setState({ titre })
                    }} />
                <Dropdown
                    onChangeText={(genre) => this.setState({ genre })}
                    label='Style'
                    labelFontSize={20}
                    dropdownPosition={0}
                    itemCount={8}
                    itemTextStyle={{ fontSize: 200 }}
                    containerStyle={{ margin: 5 }}
                    baseColor='rgba(255,255,255,1)'
                    textColor='rgba(255,255,255,1)'
                    selectedItemColor='rgba(0,0,0,1)'
                    itemColor='rgba(0,0,0,1)'
                    value='jazz'
                    data={this.style_song}
                    style={{ margin: 5 }}
                />
                <DateTimePicker
                    mode='datetime'
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
                <Button tyle={{ margin: 5, marginBottom: 5, borderRadius: 5, borderWitdh: 1, borderColor: '#FFFFFF' }} icon="event" mode="contained" onPress={() => this._showDateTimePicker()}>
                    Choisir moment de fin
                </Button>
                <Button style={{ margin: 5, marginTop: 5, borderRadius: 5, borderWitdh: 1, borderColor: '#FFFFFF' }} icon="done" mode="contained" onPress={() => this._CreateEvent()}>
                    Valider
                </Button>
                {this._displayLoading()}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: '#191414',
        color: "#FFFFFF",
    },
    textInput: {
        margin: 5,
        borderRadius: 5,
        backgroundColor: '#191414',
        borderWidth: 1,
        borderColor: '#FFFFFF'

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
})


export default CreateEvent