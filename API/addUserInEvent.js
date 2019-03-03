export async function addUserInEvent(user, uid, targetEmail) {
    const host = 'https://us-central1-music-room-42.cloudfunctions.net'
    var token = await user.getIdToken()
    let config = {
        headers: {
            'Authorization': 'Bearer ' + token
        },
        method : 'POST'
    }
    return fetch(host + '/AddUserInEvent?emailUser=' + targetEmail+'&eventUid='+uid, config)
        .then((res) => {
            console.log(res)
            return res
        })
}