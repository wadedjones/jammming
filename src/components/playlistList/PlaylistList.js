import React from 'react';
import Spotify from '../../util/Spotify';
import './PlaylistList.css';

class PlaylistList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playlistKey: []
        };
        this.addPlaylist = this.addPlaylist.bind(this);
    }
    addPlaylist(playlistId) {
        this.props.addPlaylist(playlistId)
    }
    componentDidMount() {
        Spotify.getUserPlaylists().then(response => {
            this.setState({playlistKey: response})
        });
    }
    render() {
        return (
            <div className="PlaylistList">
                <h2>Local Playlists</h2>
                <div className="playlistResults">
                    {
                        this.state.playlistKey?.map(playlist => {
                            return (
                                <div className="trackInfo">
                                    <div key={playlist.id}>
                                        <h3>{playlist.name}</h3>
                                    </div>
                                    <button className="buttonAdd" onClick={() => this.addPlaylist(playlist.id)}>+</button>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}

export default PlaylistList;