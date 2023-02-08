import React from 'react';
import './Playlist.css';
import TrackList from '../tracklist/TrackList';

class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
    }
    render() {
        return (
            <div className="Playlist">
                <input defaultValue={'New Playlist'} onChange={this.handleNameChange} />
                <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true} />
                <button className="Playlist-save">SAVE TO SPOTIFY</button>
            </div> 
        );
    }
    handleNameChange(event) {
        this.props.onNameChange(event.target.value);
    }
};

export default Playlist;