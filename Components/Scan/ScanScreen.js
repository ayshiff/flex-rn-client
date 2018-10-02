

import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'
import {
  AppRegistry, Text, TouchableOpacity, Linking,
} from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import config from '../../config/api'
import server from '../../config/server'
import styles from './ScanScreenStyles'


class ScanScreen extends Component {
  static navigationOptions = {
    title: 'Scan',
  }

  constructor() {
    super()
    this.state = {
      name: '',
      fname: '',
      id: '',
      place: '',
      debug: '',
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('USER', (err, result) => {
      if (err || result == null) this.goTo('Login')
      else {
        this.setState(JSON.parse(result))
      }
    })
  }

  onSuccess = (e) => {
    this.setState({ place: e.data })
    this.getPlaces(this, this.sendToServ)
  }

  sendToServ(ctx, json) {
    if (
      ctx.state.name !== ''
      && ctx.state.fname !== ''
      && ctx.state.id !== ''
      && ctx.state.place !== ''
    ) {
      const ctx = ctx || window

      const payload = {
        name: ctx.state.name,
        fname: ctx.state.fname,
        id_user: ctx.state.id,
        id_place: ctx.state.place,
      }

      fetch(server.address, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': config.token,
        },
      })
        .then(res => res.json())
        .then((data) => {
          let redirect = true
          // let redirectRefacto = json.map(element => payload.id_place == element.id && element.using ? redirect = false : true )
          json.forEach((element) => {
            if (payload.id_place == element.id && element.using) redirect = false
          })
          if (redirect) {
            AsyncStorage.setItem('USER', JSON.stringify(ctx.state))

            ctx.goTo('Leave')
          }
        })
    }
  }

  getPlaces(ctx, fn) {
    ctx = ctx || window

    fetch(`${server.address}places/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-access-token': config.token,
      },
    })
      .then(res => res.json()) // transform data to json
      .then((data) => {
        fn(ctx, data)
      })
  }

  goTo(str) {
    const { navigation } = this.props
    navigation.popToTop()
    navigation.navigate(str)
  }

  render() {
    return (
      <QRCodeScanner
        onRead={this.onSuccess()}
        topContent={<Text style={styles.centerText}>Scan the QR code.</Text>}
      />
    )
  }
}

export default ScanScreen
