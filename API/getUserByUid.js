import axios from 'axios';

export async function getUserByUid(user, targetUid) {
    const host = 'https://us-central1-music-room-42.cloudfunctions.net'
    var token = await user.getIdToken()
    let config = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    return axios.get(host + '/searchUser?uid=' + targetUid, config)
        .then((res) => {
            return res.data
        })
}