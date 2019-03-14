import axios from 'axios';

export async function getUserPlaylist(user) {
    const host = 'https://us-central1-music-room-42.cloudfunctions.net'
    var token = await user.getIdToken()
    let config = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    return axios.get(host+'/getAllCurrentUserPlaylist', config)
        .then((res) => {
            // console.log('res :' + res.data)
            return res.data
        })
}