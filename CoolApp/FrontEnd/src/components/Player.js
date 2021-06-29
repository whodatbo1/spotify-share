import { Button } from '@material-ui/core';
import React, {Component} from 'react';
import * as mUI from '@material-ui/core'
import * as icons from '@material-ui/icons'
import { Link } from 'react-router-dom'

export default class Player extends Component{

    constructor(props){
        super(props);
        this.state = {}
        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.skip = this.skip.bind(this);
        this.back = this.back.bind(this);
    }

    play(){
        console.log('play')
        fetch("/auth/playback", {
            method: 'GET',
            headers: {
                'type': "play"
            }
        })
        .then((res) => {
            console.log(res);
        })
    }
    pause(){
        console.log('pause')
        fetch("/auth/playback", {
            method: 'GET',
            headers: {
                'type': "pause"
            }
        })
        .then((res) => {
            console.log(res);
        })
    }
    skip(){
        console.log('next')
        fetch("/auth/playback", {
            method: 'GET',
            headers: {
                'type': "next"
            }
        })
        .then((res) => {
            console.log(res);
        })
    }
    back(){
        console.log('previous')
        fetch("/auth/playback", {
            method: 'GET',
            headers: {
                'type': "previous"
            }
        })
        .then((res) => {
            console.log(res);
        })
    }

    render() {

        const songProgress = (this.props.time / this.props.duration) * 100;

        return <div>
            <mUI.Card>
                <mUI.Grid container alignItems='center'>
                    <mUI.Grid item align='center' xs={4}>
                        <img src={this.props.cover_url} height='100%' width='100%'></img>
                    </mUI.Grid> 
                    <mUI.Grid item alignItems='center' align='center' xs={8} sm={6}>
                        <mUI.Typography component='h5' variant='h5'>
                            {this.props.track_name}
                        </mUI.Typography>
                        <mUI.Typography color='textSecondary' variant='subtitle1'>
                            {this.props.artist_name}
                        </mUI.Typography>
                        <div>
                            <mUI.IconButton onClick={this.back}>
                                <icons.SkipPrevious/>
                            </mUI.IconButton>
                            <mUI.IconButton onClick={this.play}>
                                {this.props.is_playing ? <icons.PauseCircleOutlineSharp/> : <icons.PlayArrow/>}
                            </mUI.IconButton>
                            <mUI.IconButton onClick={this.skip}>
                                <icons.SkipNext/>
                            </mUI.IconButton>
                        </div>
                        <mUI.LinearProgress variant='determinate' value={songProgress}/>
                    </mUI.Grid>
                </mUI.Grid>
            </mUI.Card>
        </div>
    }

}