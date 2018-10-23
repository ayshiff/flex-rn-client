// @flow
import React from 'react';

import { View } from 'react-native';
import { AsyncStorage } from 'react-native';
import { Button, Card, Text } from 'react-native-elements';
import config from "../../config/api";
import server from "../../config/server";
import styles from "./LeaveScreenStyles";
import type { State, Props } from "./LeaveScreenType";
import { getPlaces, goTo } from '../../utils/utils';


type Payload = {
  name: string,
  fname: string,
  id_user: string,
  id_place: string,
  historical: string | Array<object>
};

class LeaveScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: "Leave"
  };

  constructor() {
    super();
    this.state = {
      name: "",
      fname: "",
      id: "",
      place: "",
      debug: "",
      historical: ""
    };
  }

  leavePlace(ctx) {
    const { name, fname, id, place, historical } = ctx.state;
    ctx = ctx || window;

    const payload = {
      name,
      fname,
      id_user: id,
      id_place: place,
      historical,
    };
    fetch(server.address, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        "x-access-token": config.token
      }
    })
      .then(res => {
        if (res.ok) return res.json();
        else ctx.setState({ debug: "ERROR" });
      })
      .then(data => {
        ctx.state.debug = "";
        ctx.state.place = "";
        AsyncStorage.setItem("USER", JSON.stringify(ctx.state));
        goTo(ctx, "Profile");
      });
  }

  componentDidMount() {
    AsyncStorage.getItem("USER", (err, result) => {
      if (err || result == null) goTo(this, "Login");
      else {
        console.log(result)
        this.setState(JSON.parse(result));
        const userId: string = JSON.parse(result).id;
        fetch(`${server.address}users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "x-access-token": config.token
          }
        })
          .then(res => res.json()) // transform data to json
          .then(data => {
            this.setState({ historical: data[0].historical });
          })
      }
    });
  }

  render() {
    const { fname, name, id, place } = this.state;
    return (
      <Card style={styles.view}>
        <Text>
          {fname}
          {name}[{id}
          ]:
          {place}
        </Text>
        <Button
          style={styles.button}
          fontWeight="bold"
          borderRadius={15}
          backgroundColor="#5167A4"
          color="#fff"
          title="Leave place"
          onPress={() => this.leavePlace(this)}
        />
      </Card>
    );
  }
}
export default LeaveScreen
