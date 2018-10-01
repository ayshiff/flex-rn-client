import React from 'react'

import { View, Text, Button } from 'react-native'
import { AsyncStorage } from 'react-native';
import config from '../../config/api';
import server from '../../config/server';
import styles from './LeaveScreenStyles';

class LeaveScreen extends React.Component {
  static navigationOptions = {
    title: 'Leave',
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

  goTo(str) {
    const navigation = this.props.navigation;
    navigation.popToTop();
    navigation.navigate(str);
  }

  leavePlace(ctx) {
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
    .then(res => {
      if(res.ok)
        return res.json();
      else
        ctx.setState({debug:'ERROR'});
    })
    .then(data => {
      ctx.state.debug = 'Leave';
      ctx.state.place = '';
      AsyncStorage.setItem('USER', JSON.stringify(ctx.state));
      ctx.goTo('Profile');
    });
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

  render() {
    return (
      <View style={styles.view}>
        <Text>{this.state.fname} {this.state.name} [{this.state.id}]: {this.state.place}</Text>
        <Button style={styles.button} title='Leave place'
        color="#000"
        onPress={() => this.leavePlace(this)}/>
      </View>
    )
  }
}
export default LeaveScreen;
