import axios from 'axios';

export async function getUserPlaylist(user) {

    var token = await user.getIdToken()
    let config = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    return axios.get('https://us-central1-music-room-42.cloudfunctions.net/getAllCurrentUserPlaylist', config)
        .then((res) => {
            // console.log('res :' + res.data)
            return res.data
        })
}