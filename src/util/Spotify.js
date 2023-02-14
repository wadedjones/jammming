
let accessToken;
let userId;
const clientId = '17825e094a0d420cb9ccd0612776923a';
const redirectUri = 'http://localhost:3000/' // 'mundane-card.surge.sh'

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = expiresInMatch[1];
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
            window.location = accessUrl;
        }
    },
    getUserId() {
        if (userId) {
            console.log(userId)
            return userId;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`}
        return fetch('https://api.spotify.com/v1/me', {headers: headers}
        ).then(response => response.json()
        ).then(jsonResponse => {
            userId = jsonResponse.id;
            console.log(userId)
            return userId;
        });
    },
    search(term) {
        const accessToken = Spotify.getAccessToken();
        console.log(accessToken)
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        })
    },
    savePlaylist(name, trackURIs) {
        if (!name || !trackURIs.length) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        let userId = Spotify.getUserId();
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
        {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({name: name})
        }).then(response => response.json()
        ).then(jsonResponse => {
            const playlistId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, 
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({uris: trackURIs})
            })
        })
    },
    getUserPlaylists() {
        const userId = Spotify.getUserId();
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        return fetch(`https://api.spotify.com/v1/me/playlists`, {
            headers: headers,
            method: 'GET'
        }).then(response => response.json()
        ).then(jsonResponse => {
            const playlistArr = jsonResponse.items.map(playlist => ({
                id: playlist.id,
                name: playlist.name
            }))
            //console.log(playlistArr);
            return playlistArr;
        })
    }
}

export default Spotify;