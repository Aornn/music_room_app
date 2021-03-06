import axios from 'axios';

export async function getAllUserPlaylist(user, targetUid) {
    if (user === null)
    {
        console.log('no user  getAllUserPlaylis')
        throw new Error('No User found') 
    }
    const host = 'https://us-central1-music-room-42.cloudfunctions.net'
    var token = await user.getIdToken()
    let config = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    return axios.get(host + '/getAllUserPlaylist?userId=' + targetUid, config)
        .then((res) => {
            return res.data
        })
}