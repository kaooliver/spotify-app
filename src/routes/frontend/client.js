import React, { Component } from 'react';
import './App.css';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      bpm: 0,
      dance: "0",
      userid: "",
      playlistid:"",
      songlist:[],
      token: token
    }
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange1(event) {
    this.setState({dance: event.target.value});
    // sessionStorage.setItem('access_token',this.state.token)
  }

  handleChange2(event) {
    this.setState({bpm: event.target.value});
  }


  async handleSubmit(event) {
    var test = []
    await fetch(`https://api.spotify.com/v1/recommendations?seed_genres=hip-hop&target_danceability=${this.state.dance}`,{
      method: 'GET',
      headers: {
        'Authorization' : `Bearer ${this.state.token}`
      }
    })
    .then(response => response.json())
    .then(data => this.setState({songlist:data.tracks}))

    for (var x in this.state.songlist){
      test.push(this.state.songlist[x].uri)
    }
    var test1 = JSON.stringify(test)
    console.log(test1)

    
   await fetch(`https://api.spotify.com/v1/me`,{
      method: 'GET',
      headers: {
        'Authorization' : `Bearer ${this.state.token}`
      }
    })
    .then(response => response.json())
    .then(data => this.setState({userid:data.id}))
    .then(console.log(this.state.userid))

    await fetch(`https://api.spotify.com/v1/users/${this.state.userid}/playlists`,{
      method: 'POST',
      body: '{"name":"success"}',
      headers: {
        'Authorization' : `Bearer ${this.state.token}`,
        'Content-Type' : 'application/json'
      }      
    })
    .then(response => response.json())
    .then(data => this.setState({playlistid:data.id}))

    await fetch(`https://api.spotify.com/v1/playlists/${this.state.playlistid}/tracks`,{
      method: 'POST',
      body: `{"uris": ${test1}}`,
      headers: {
        'Authorization' : `Bearer ${this.state.token}`,
        'Content-Type' : 'application/json'
      }      
    })
    .then(response => response.json())
    .then(data => console.log(data))

  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying(){
    
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        if (response.item){
        this.setState({
          nowPlaying: { 
              name: response.item.name, 
              albumArt: response.item.album.images[0].url
            }
        });
        var id = response.item.id
        fetch(`https://api.spotify.com/v1/audio-features/${id}`,{
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.state.token}`
          }
        } 
        )
        .then(response1 => response1.json()) 
        .then(data => this.setState({bpm:data.tempo,dance:data.danceability}))
        
      }
      else {
        this.setState({
          nowPlaying: {
            name: 'No song playing'
          }
        })
      }
      })
  }
  render() {
    return (
      <div className="App">
        {!this.state.loggedIn && <a href='http://localhost:8888/login' > Login to Spotify </a>}
        <div>
          Now Playing: { this.state.nowPlaying.name }
        </div>
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
        </div>
        <div>
          BPM: {this.state.bpm}
          Dancebility: {this.state.dance}
        </div>
        { this.state.loggedIn &&
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        }
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>
              Dancebility (0.0-1.0):
              <input type="text" name="dance" value={this.state.dance} onChange={this.handleChange1} />
            </label>
            <label>
              BPM (60-200):
              <input type="number" name="BPM" value='60' min="60"max="250" onChange={this.handleChange2}/>
            </label>
          <input type="submit" value="Submit" />
          </form>
        </div>
      </div>
    );
  }
}

export default App;
