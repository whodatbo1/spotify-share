import React, { Component } from "react";
import * as mUI from '@material-ui/core';
import { Link }  from 'react-router-dom';

export default class RoomJoinPage extends Component{

    constructor(props){
        super(props);
        this.state = {
            roomCode: '',
            error: ''
        }
        this.handleTextFiledChange = this.handleTextFiledChange.bind(this)
        this.handleJoin = this.handleJoin.bind(this)
    }

    handleTextFiledChange(e){
        this.setState({
            roomCode: e.target.value
        })
    }

    handleJoin(){
        const reqOps = {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                code: this.state.roomCode
            })
        };
        fetch('/api/room/join', reqOps)
        .then((res) => {
            if (res.ok) {
                this.props.history.push(`/room/${this.state.roomCode}`)
            } else {
                this.setState({
                    error: res.json.error
                });
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    render(){
        return (
            <mUI.Grid container spacing = {3} align='center'>
                <mUI.Grid item xs={12}>
                    <mUI.Typography component='h4' variant='h4'>
                        Join room
                    </mUI.Typography>
                </mUI.Grid>

                <mUI.Grid item xs={12}>
                    <mUI.TextField 
                        error={this.state.error}
                        label='Code'
                        placeholder='Room Code'
                        value={this.state.roomCode}
                        helperText={this.state.error}
                        variant='outlined'
                        onChange={this.handleTextFiledChange}
                    />
                </mUI.Grid>
                
                <mUI.Grid item sm align='right'>
                    <mUI.Button color='secondary' variant='contained' to='/' component={Link}>
                        Back
                    </mUI.Button>
                </mUI.Grid>
                <mUI.Grid item sm align='left'>
                    <mUI.Button color='primary' variant='contained' onClick={this.handleJoin}>
                        Join
                    </mUI.Button>
                </mUI.Grid>
                
            </mUI.Grid>
        )
    }

}