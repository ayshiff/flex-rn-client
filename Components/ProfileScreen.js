import React from 'react'

import { View, Text, Button, TextInput } from 'react-native'
import { AsyncStorage } from 'react-native';
import config from '../config/api';
import server from '../config/server';


class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };

  constructor(){
    super();
    this.state = {
      name: '',
      fname: '',
      id:'',
      place:'',
      debug:'',
    }
  }

  componentDidMount(){
    AsyncStorage.getItem('USER', (err, result) => {
      if(err || result == null)
        this.goTo('Login');
      else {
        this.setState(JSON.parse(result));
      }
    });
  }

  sendToServ(ctx, json) {
    if(ctx.state.name != '' && ctx.state.fname != '' && ctx.state.id != '' && ctx.state.place != '')
    {
      var ctx = ctx || window;

      var payload = {
          name: ctx.state.name,
          fname: ctx.state.fname,
          id_user: ctx.state.id,
          id_place: ctx.state.place
      };

      fetch(server.address , {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "x-access-token": config.token
        }
      })
      .then(function(res){
        return res.json();
      })
      .then(function(data){
        var redirect = true;
        json.forEach(function(element){
          if(payload.id_place == element.id && element.using)
            redirect = false;
        });
        if(redirect)
        {
          ctx.state.debug = 'Wellcome';
          AsyncStorage.setItem('USER', JSON.stringify(ctx.state));

          ctx.goTo('Leave');
        }
      })
    }
  }

  getPlaces(ctx, fn) {
    ctx = ctx || window;

    fetch(server.address + "places/", {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-access-token": config.token
      }
    })
    .then(function(res){ return res.json(); })//transform data to json
    .then(function(data)
    {
      fn(ctx, data);
    });
  }

  async setDebug(ctx, json) {
    var result = '';
    json.forEach(function(element){
      if(!element.using)
      {
        result += element.id + ',';
      }
    });
    ctx.setState({debug:result});
  }

  goTo(str) {
    const navigation = this.props.navigation;
    navigation.popToTop();
    navigation.navigate(str);
  }

  _logOut() {
    AsyncStorage.removeItem('USER');
    this.goTo('Login');
  }

  render() {
    const navigation = this.props.navigation;

    return (
      <View style={{flexDirection:'column',}}>

        <View style={{flexDirection: 'row', justifyContent: 'space-between',margin:5}}>
          <Text style={{margin:5, marginTop:8}}>{this.state.fname} {this.state.name} [{this.state.id}]</Text>

          <Button title='Log Out'
          color="#000"
          onPress={() => this._logOut()}/>
        </View>

        <View style={{ borderRadius: 4, borderWidth: 0.5,}}/>

        <Text style={{marginLeft:10,marginTop:20}}>Insertion manuelle</Text>

        <View style={{margin:10, borderRadius: 4, borderWidth: 0.5,marginRight:50,marginLeft:50}}>
          <TextInput
            placeholder="Place"
            onChangeText={(text) => this.setState({place:text})}
          />
        </View>

        <View style={{marginRight:50,marginLeft:50,}}>
          <Button title='Send'
          color="#000"
          onPress={() => this.getPlaces(this, this.sendToServ)}/>
        </View>

        <View style={{ marginTop:20, borderRadius: 4, borderWidth: 0.5,}}/>

        <Text style={{marginLeft:10,marginTop:20}}>Scan QR code</Text>

        <View style={{margin:20, marginRight:50, marginLeft:50, justifyContent:'flex-end'}}>
          <Button title='Scan'
          color="#000"
          onPress={() => navigation.navigate('Scan') }/>
        </View>

        <View style={{ marginTop:20, borderRadius: 4, borderWidth: 0.5,}}/>

        <View style={{marginTop:20,marginLeft:50, marginRight:50}}>
          <Button title='Places libres'
          color="#000"
          onPress={() => this.getPlaces(this, this.setDebug)}/>
        </View>
        <Text>{ this.state.debug }</Text>

      </View>
    )
  }
}

export default ProfileScreen;
