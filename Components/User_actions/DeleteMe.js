import firebase from 'react-native-firebase';

function getToken(user) {
    return user.getIdToken().then((token) => {
        return token
    })
}

export async function deleteMe(user) {
    var token = await getToken(user)
    // axios.get('https://us-central1-music-room-42.cloudfunctions.net/deleteUser', { headers: { 'Authorization': 'Bearer ' + token } })
    //     .then(() => {
    //         firebase.auth().signOut().then(() => {
    //             this.props.navigation.navigate('Loading')
    //         })
    //         console.log("Successfully destroy")
    //     })
    console.log("SUPPR : " + token)
}