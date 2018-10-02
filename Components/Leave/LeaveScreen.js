import React from 'react'

import { View } from 'react-native'
import { AsyncStorage } from 'react-native'
import config from '../../config/api'
import server from '../../config/server'
import styles from './LeaveScreenStyles'

import {
  Button,
  Card,
  Text,
} from "react-native-elements";

class LeaveScreen extends React.Component {
  static navigationOptions = {
    title: 'Leave',
  }

  constructor() {
    super()
    this.state = {
      name: null,
      fname: null,
      id: null,
      place: null,
      debug: [],
    }
  }

  leavePlace(ctx) {
    ctx = ctx || window

    const payload = {
      name: ctx.state.name,
      fname: ctx.state.fname,
      id_user: ctx.state.id,
      id_place: ctx.state.place,
    }
    console.log(payload)
    fetch(server.address, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': config.token,
      },
    })
          .then(res => {
            console.log("res", res)
      if(res.ok)
        return res.json();
      else
        ctx.setState({debug:'ERROR'});
    })
      .then((data) => {
        console.log(data, ctx.data)
        ctx.state.debug = null;
        ctx.state.place = null;
        AsyncStorage.setItem('USER', JSON.stringify(ctx.state))
        ctx.goTo('Profile')
      })
  }

  componentDidMount() {
    AsyncStorage.getItem('USER', (err, result) => {
      if (err || result == null) this.goTo('Login')
      else {
        this.setState(JSON.parse(result))
      }
    })
  }

  goTo(str) {
    const navigation = this.props.navigation
    navigation.popToTop()
    navigation.navigate(str)
  }

  render() {
    const { fname, name, id, place } = this.state;
    return (
      <Card style={styles.view}>
        <Text>
          {fname}
          {name}
[
          {id}
          ]:
          {place}
        </Text>
        <Button
          style={styles.button}
          fontWeight="bold" borderRadius={15} backgroundColor="#5167A4" color="#fff"
          title="Leave place"
          onPress={() => this.leavePlace(this)}
        />
      </Card>
    )
  }
}
export default LeaveScreen
