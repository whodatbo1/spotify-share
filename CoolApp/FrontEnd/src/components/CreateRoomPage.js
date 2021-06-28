import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export default class CreateRoomPage extends Component{
    defaultVotes = 2;

    constructor(props){
        super(props);
        this.state = {
            guest_can_pause: false,
            votes_to_skip: this.defaultVotes,
        };
        this.handleCreateRoom = this.handleCreateRoom.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
        this.handleVotesChange = this.handleVotesChange.bind(this);
    }

    handleVotesChange(e){
        this.setState({
            votes_to_skip: e.target.value,
        });
    }

    handleGuestCanPauseChange(e){
        this.setState({
            guest_can_pause: e.target.value === 'true' ? true : false,
        });
    }

    handleCreateRoom(){
        const reqOptions = {
            method: "POST",
            headers: {'Content-type':'application/json'},
            body: JSON.stringify(this.state)
        };
        fetch('/api/room/create', reqOptions)
        .then((res) =>res.json())
        .then((data) => {
            this.props.history.push('room/' + data.code);
        });
    }

    render(){
        return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component='h4' variant='h4'>
                    Create a Listening Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center">
                            Can Guests Pause:
                        </div>
                    </FormHelperText>
                    <RadioGroup row defaultValue='true' onChange={this.handleGuestCanPauseChange}>
                        <FormControlLabel 
                            value='true' 
                            control={<Radio color='primary' />}
                            label="Play/Pause"
                            lavelPlacement='bottom' />
                        <FormControlLabel 
                            value='false' 
                            control={<Radio color='secondary' />}
                            label="No"
                            lavelPlacement='bottom' />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <FormHelperText>
                        <div align='center'>
                            Votes to skip
                        </div>    
                    </FormHelperText>  
                    <TextField type='number'
                        defaultValue={this.defaultVotes}
                        onChange={this.handleVotesChange}
                        inputProps={
                            {
                                min: 1, 
                                style:{textAlign: "center"}
                            }
                        }
                    />                 
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" onClick={this.handleCreateRoom}>
                    Create Room
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" to='/' component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>
        );
    }
}