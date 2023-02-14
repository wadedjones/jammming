import React from 'react';
import Spotify from '../../util/Spotify';
import './PlaylistList.css';

class PlaylistList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playlistKey: []
        };
    }
    componentDidMount() {
        Spotify.getUserPlaylists().then(response => {
            this.setState({playlistKey: response})
        }).then(console.log(this.state.playlistKey))
    }
    render() {
        return (
            <div className="PlaylistList">
                <div className="title">
                    Local Playlists
                </div>
                <div>
                    {
                        this.state.playlistKey?.map(playlist => {
                            return <div key={playlist.id}>{playlist.name}</div>
                        })
                    }
                </div>
            </div>
        );
    }
}

export default PlaylistList;