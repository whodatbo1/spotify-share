import mars from '../../static/images/Mars_Perseverance.png'
import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import * as mUI from "@material-ui/core"

import CreateRoomPage from "./CreateRoomPage";
import RoomJoinPage from "./RoomJoinPage"
import Room from "./Room"
import spotify_page from "./spotify_page"

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room_code: null,
    }
  }

  render() {
    return (<Router>
        <Switch>
            <Route exact path="/">
            <mUI.Grid container color='primary' spacing='1' align='center'>
              <mUI.Grid item xs={12}>
                <mUI.Typography component='h4' variant='h4'>
                  <p>Welcome to Mars, motherfucker.</p>
                </mUI.Typography>
              </mUI.Grid>

              <mUI.Grid item xs={12}>
                <img src={mars} width={600}></img>
              </mUI.Grid>

              <mUI.Grid item xs={12}>
                  <mUI.Button color="primary" variant='contained' to='/join' component={Link}>
                    Join a room
                  </mUI.Button>
              </mUI.Grid>
              
              <mUI.Grid item xs={12}>
                <mUI.Button color="secondary" variant='contained' to='/create' component={Link}>
                  Create a room
                </mUI.Button>
              </mUI.Grid>
            </mUI.Grid>
            </Route>
            <Route path="/join" component={RoomJoinPage}/>
            <Route path="/create" component={CreateRoomPage}/>
            <Route path="/room/:code" component={Room}/>
            <Route path="/s" component={spotify_page}/>
        </Switch>
    </Router>);
  }
}
