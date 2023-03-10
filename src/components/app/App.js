import React from 'react';
import './App.css';
import SearchBar from '../searchbar/SearchBar';
import SearchResults from '../searchresults/SearchResults';
import Playlist from '../playlist/Playlist';
import Spotify from '../../util/Spotify';
import PlaylistList from '../playlistList/PlaylistList';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.addPlaylist = this.addPlaylist.bind(this);
  }
  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({playlistTracks: tracks})
  }
  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({playlistTracks: tracks})
  }
  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }
  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }
  search(term) {
    console.log(term);
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults})
    });
  }
  addPlaylist(playlistId) {
    /*Spotify.getUserPlaylists().then(playlistArr => {
      playlistArr?.map(name => {
        console.log(playlistId === name.id)
        if (name.id === playlistId) {
          this.setState({playlistName: name.name})
        }
      })
    }
    )*/
    //this.setState({playlistName: pl})
    this.setState({playlistTracks: []});
    Spotify.getPlaylistTracks(playlistId).then(tracks => {
      console.log(tracks);
      tracks?.map(track => {
        this.addTrack(track);
      })
    }
    );
    //tracks?.map(track => {
    //  this.addTrack(track);
    //});
    //console.log(tracks);
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults}
                           onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} 
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist} />
            <PlaylistList addPlaylist={this.addPlaylist}/>
          </div>
        </div>
      </div>
    );
  }
};

export default App;