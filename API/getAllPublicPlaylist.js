import axios from 'axios';

export async function getAllPublicPlaylist(user) {
    if (user === null)
    {
        console.log('no user getAllPublicPlaylist')
        throw new Error('No User found') 
    }
    const host = 'https://us-central1-music-room-42.cloudfunctions.net'
    var token = await user.getIdToken()
    let config = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    return axios.get(host+'/getAllPlaylist', config)
        .then((res) => {
            // console.log('res :' + res.data)
            return res.data
        })
}