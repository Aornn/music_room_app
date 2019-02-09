import axios from 'axios';

export async function getAllPublicEvent(user, lon, lat, timestamp) {

    var lon;
    var lat;
    var timestamp;
    var token = await user.getIdToken()
    let config = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    //https://us-central1-music-room-42.cloudfunctions.net/getAllEvent?end=1550415272&lon=48.91719117368271&lat=2.3523520099258803
    return axios.get('https://us-central1-music-room-42.cloudfunctions.net/getAllEvent?end='+timestamp+'&lon='+lon+'&lat='+lat, config)
        .then((res) => {
            // console.log('res :' + res.data)
            return res.data
        })
}