import axios from 'axios';

export async function getAllPublicEvent(user, lon, lat, timestamp) {
    if (user === null)
    {
        console.log('no user getAllPublicEvent')
        throw new Error('No User found') 
    }
    const host = 'https://us-central1-music-room-42.cloudfunctions.net'
    var lon;
    var lat;
    var timestamp;
    var token = await user.getIdToken()
    let config = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    return axios.get(host + '/getAllEvent?end='+timestamp+'&lon='+lon+'&lat='+lat, config)
        .then((res) => {
            // console.log('res :' + res.data)
            return res.data
        })
}