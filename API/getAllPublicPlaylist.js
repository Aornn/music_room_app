import axios from 'axios';

export async function getAllPublicPlaylist(user) {

    var token = await user.getIdToken()
    let config = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    return axios.get('https://us-central1-music-room-42.cloudfunctions.net/getAllPlaylist', config)
        .then((res) => {
            // console.log('res :' + res.data)
            return res.data
        })
}