import { Button } from '@material-ui/core';
import React, {Component} from 'react';
import * as mUI from '@material-ui/core'
import { Link } from 'react-router-dom'
import Player from './Player'

export default class Room extends Component{
    constructor(props){
        super(props);
        this.state={
            votes_to_skip: 2,
            guest_can_pause: false,
            is_host: false,
            spotify_authenticated: false,
            song_info: {cover_url: 'https://i.scdn.co/image/ab67616d0000b273a54f2b401501b3569990c256'}
        };
        this.code = this.props.match.params.code;
        this.getRoom();
        this.obtain_auth();
        this.obtain_auth = this.obtain_auth.bind(this);
        this.getRoom = this.getRoom.bind(this);
        this.leaveRoom = this.leaveRoom.bind(this);
        this.authenticate_spotify = this.authenticate_spotify.bind(this);
        this.get_curr_song = this.get_curr_song.bind(this);
    }

    componentDidMount(){
        this.interval = setInterval(this.get_curr_song, 1000);
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    authenticate_spotify(){
        fetch('/auth/is-auth')
        .then((res) => res.json())
        .then((data) => {
            this.setState({spotify_authenticated: data.status})
            if(!data.status) {
                fetch('/auth/auth-uri').then((res) => {
                    return res.headers.get('url')
                    }).then((url) => {
                        window.location.replace(url);
                })
            }
        });
    }

    get_curr_song(){
        fetch('/auth/curr-song')
        .then((res) => {
            // let cover = res.headers.get('album_cover');
            // let album_name = res.headers.get('album_name');
            // let date = res.headers.get('album_date');
            // console.log("re", cover, album_name, date, track_name, artist_name);
            if (this.state.song_info.cover_url != res.headers.get('album_cover')){
                var styleElem = document.head.appendChild(document.createElement("style"));
                styleElem.innerHTML = "#app:after {background-image: url(" + res.headers.get('album_cover') + "); background-size: 50%;}";
            }
            this.setState({song_info: {"track_name": res.headers.get('track_name'),
                                       "artist_name": res.headers.get('artist_name'),
                                       "album_name": res.headers.get('album_name'),
                                       "cover_url": res.headers.get('album_cover'),
                                       "duration": res.headers.get('duration'),
                                       "time": res.headers.get('progress'),
                                       "is_playing": res.headers.get('is_playing')}})
        });
    }

    obtain_auth(){
        fetch('/auth/auth-uri')
        .then((res) => res.json)
        .then((data) => {
            var uri = data.uri
            fetch(uri)
            .then((response) => response.json)
            .then((data) => {
            })
        });
    }

    leaveRoom(){
        const reqOps = {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
        }
        fetch('/api/room/leave', reqOps)
            .then((res) => {
                console.log(res)
                this.props.history.push('/');
            });
    }

    getRoom(){
        console.log("getting data...")
        const reqOptions = {
            method: "GET",
        }
        fetch('/api/room/get' + '?code=' + this.code, reqOptions)
        .then((res) => res.json())
        .then((data) => {
            this.setState(
                {
                    votes_to_skip: data.votes_to_skip,
                    guest_can_pause: data.guest_can_pause,
                    is_host: data.is_host,
                }
            );
            if (this.state.is_host){
                this.authenticate_spotify()
                console.log("nice")
            }
        });
    }

    render(){
        return <div id ='room'>
            <mUI.Grid container spacing={1} align='center'>
                <mUI.Grid item xs={12} align='center'>
                    {/* <mUI.MenuList style={{backgroundColor: 'black', color: 'white'}}>
                        <mUI.MenuItem align='center'>{this.state.song_info.track_name}</mUI.MenuItem>
                        <mUI.MenuItem align='center'>{this.state.song_info.artist_name}</mUI.MenuItem>
                        <mUI.MenuItem>{this.state.song_info.album_name}</mUI.MenuItem>
                    </mUI.MenuList> */}
                    <Player {...this.state.song_info}/>
                    <Button color='secondary' onClick={this.leaveRoom}>
                        Leave Room
                    </Button>
                </mUI.Grid>
            </mUI.Grid>
        </div>;
    }
}