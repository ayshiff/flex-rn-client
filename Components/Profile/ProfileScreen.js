import React from 'react'

import { View, Text, Button, TextInput } from 'react-native'
import { AsyncStorage } from 'react-native';
import config from '../../config/api';
import server from '../../config/server';
import styles from './ProfileScreenStyles';
import {  } from 'ramda';


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
      ctx = ctx || window;

      let payload = {
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
      .then(res => res.json())
      .then(data => {
        var redirect = true;
        json.forEach(element => {
          if(payload.id_place == element.id && element.using)
            redirect = false;
        });
        if(redirect)
        {
          ctx.state.debug = 'Welcome';
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
    .then(res => res.json())//transform data to json
    .then(data =>
    {
      fn(ctx, data);
    });
  }

  async setDebug(ctx, json) {
    const result = json
    .map(element => !element.using ? element.id : null)
    .reduce((Accumulator, currentValue) => currentValue !== null ? Accumulator + ',' + currentValue : null)
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
    const { fname, name, id, debug } = this.state;

    return (
      <View style={styles.view}>

        <View style={styles.view_second}>
          <Text style={styles.text_first}>{fname} {name} [{id}]</Text>

          <Button
          style={styles.logOut}
          title='Log Out'
          color="#000"
          onPress={() => this._logOut()}/>
        </View>

        <View style={styles.view_third}/>

        <Text style={styles.manualInsertion}>Insertion manuelle</Text>

        <View style={styles.place}>
          <TextInput
            placeholder="Place"
            onChangeText={(text) => this.setState({place:text})}
          />
        </View>

        <View style={styles.sendContainer}>
          <Button
          style={styles.send}
          title='Send'
          color="#000"
          onPress={() => this.getPlaces(this, this.sendToServ)}/>
        </View>

        <View style={styles.view_fourth}/>

        <Text style={styles.scanQRCode}>Scan QR code</Text>

        <View style={styles.scan_container}>
          <Button
          style={styles.scan}
          title='Scan'
          color="#000"
          onPress={() => navigation.navigate('Scan') }/>
        </View>

        <View style={styles.view_fifth}/>

        <View style={styles.emptyPlaces_container}>
          <Button title='Places libres'
          color="#000"
          onPress={() => this.getPlaces(this, this.setDebug)}/>
        </View>
        <Text>{ debug }</Text>

      </View>
    )
  }
}

export default ProfileScreen;
