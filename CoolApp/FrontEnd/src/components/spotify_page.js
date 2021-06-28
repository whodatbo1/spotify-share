import React, {Component} from 'react'

export default class spotify_page extends Component{

    constructor(props){
        super(props);
        this.state = {};
        this.obtain_auth();
    }

    obtain_auth(){
        console.log("obtaining data...")
        fetch('/auth/auth-uri')
        .then((res) => {
            return res.headers.get('url')
        })
        .then((url) => {
            console.log('data', url)
            fetch(url)
            .then((response) => {
                console.log("response", response)
                response.json
            })
            .then((data) => {
                console.log("i am spotify")
                console.log(data)
            })
        });
    }

    render(){
        return <div>
            <p>ok</p>
        </div>
    }
}