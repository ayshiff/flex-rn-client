import React from 'react';
import NavigationApp from './Navigation/NavigationApp';
import config from './config/api';
import server from './config/server';

export default class App extends React.Component {
  componentWillMount(){
    var payload = {
        email: config.email,
        password: config.password
    };

    fetch(server.address + "login", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(function(res){
      return res.json();
    })
    .then(function(data){
      config.token = data.token;
      fetch(server.address + "me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": config.token
        }
      })
      .then(function(res){
        return res.json();
      })
      .then(function(data){
        config._id = data._id;
      })
    })
  }

  render() {
    return (
      <NavigationApp/>
    )
  }
}
