export async function deletePlaylist(user, uid) {
    const host = 'https://us-central1-music-room-42.cloudfunctions.net'
    var token = await user.getIdToken()
    let config = {
        headers: {
            'Authorization': 'Bearer ' + token
        },
        method: 'POST'
    }
    return fetch(host + '/deletePlaylist?playlistUid=' + uid, config)
        .then((res) => {
            return res
        })
}