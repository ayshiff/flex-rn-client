// @flow
import React from "react";
import {
  Button,
  Card,
  FormInput,
  Text,
  List,
  ListItem,
  SearchBar
} from "react-native-elements";

import { View, TextInput, AsyncStorage, ScrollView } from "react-native";
import config from "../../config/api";
import server from "../../config/server";
import styles from "./ProfileScreenStyles";

type State = {
  name: ?string,
  fname: ?string,
  id: ?string,
  place: ?string,
  debug: ?array
};

class ProfileScreen extends React.Component<State> {
  static navigationOptions = {
    title: "Profile"
  };

  constructor() {
    super();
    this.state = {
      name: "",
      fname: "",
      id: "",
      place: "",
      debug: ""
    };
  }

  componentDidMount() {
    AsyncStorage.getItem("USER", (err, result) => {
      if (err || result === null) this.goTo("Login");
      else {
        this.setState(JSON.parse(result));
      }
    });
  }

  sendToServ(ctx, json) {
    if (
      ctx.state.name !== "" &&
      ctx.state.fname !== "" &&
      ctx.state.id !== "" &&
      ctx.state.place !== ""
    ) {
      ctx = ctx || window;

      let payload = {
        name: ctx.state.name,
        fname: ctx.state.fname,
        id_user: ctx.state.id,
        id_place: ctx.state.place
      };
      console.log(payload);
      fetch(server.address, {
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
          json.map(
            element =>
              payload.id_place == element.id && element.using
                ? (redirect = false)
                : null
          );
          if (redirect) {
            AsyncStorage.setItem("USER", JSON.stringify(ctx.state));

            ctx.goTo("Leave");
          }
        });
    }
  }

  getPlaces(ctx, fn, l = null) {
    ctx = ctx || window;

    fetch(server.address + "places/", {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-access-token": config.token
      }
    })
      .then(res => res.json()) //transform data to json
      .then(data => {
        if (l) {
          fn(ctx, l);
        } else {
          fn(ctx, data);
        }
      });
  }

  async setDebug(ctx, json) {
    const result = json.filter(
      element => element !== null && element.using === false
    );
    console.log(result);
    ctx.setState({ debug: result });
  }

  goTo(str) {
    const navigation = this.props.navigation;
    navigation.popToTop();
    navigation.navigate(str);
  }

  logOut() {
    AsyncStorage.removeItem("USER");
    this.goTo("Login");
  }

  getUser(ctx, l) {
    if (
      ctx.state.name !== "" &&
      ctx.state.fname !== "" &&
      ctx.state.id !== "" &&
      l.id !== ""
    ) {
      ctx = ctx || window;

      let payload = {
        name: ctx.state.name,
        fname: ctx.state.fname,
        id_user: ctx.state.id,
        id_place: l.id
      };
      fetch(server.address, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "x-access-token": config.token
        }
      })
        .then(res => res.json())
        .then(data => {
          let redirect = true;
          payload.id_place == l.id && l.using ? (redirect = false) : null;
          if (redirect) {
            AsyncStorage.setItem(
              "USER",
              JSON.stringify({
                name: payload.name,
                fname: payload.fname,
                id: payload.id_user,
                place: payload.id_place,
                debug: ctx.state.debug
              })
            );

            console.log("getUser", payload, ctx.state, data);
            ctx.goTo("Leave");
          }
        });
    }
  }

  render() {
    const navigation = this.props.navigation;
    const { fname, name, id, debug } = this.state;

    return (
      <ScrollView style={styles.view}>
        <View style={styles.view_second}>
          <Text h4 style={styles.text_first}>
            {fname} {name} [{id}]
          </Text>
          <Button
            fontWeight="bold"
            fontSize={12}
            borderRadius={15}
            backgroundColor="#5167A4"
            color="#fff"
            style={styles.logOut}
            title="Log Out"
            onPress={() => this.logOut()}
          />
        </View>

        <Card title="Manual insertion">
          <FormInput
            style={styles.place}
            placeholder="Place"
            onChangeText={text => this.setState({ place: text })}
          />

          <View style={styles.sendContainer}>
            <Button
              fontWeight="bold"
              borderRadius={15}
              backgroundColor="#5167A4"
              color="#fff"
              style={styles.send}
              title="Send"
              onPress={() => this.getPlaces(this, this.sendToServ)}
            />
          </View>
        </Card>

        <Card title="Scan QR code">
          <View style={styles.scan_container}>
            <Button
              fontWeight="bold"
              borderRadius={15}
              backgroundColor="#5167A4"
              color="#fff"
              style={styles.scan}
              title="Scan"
              onPress={() => navigation.navigate("Scan")}
            />
          </View>
        </Card>

        <Card>
          <View style={styles.emptyPlaces_container}>
            <Button
              fontWeight="bold"
              large={false}
              borderRadius={15}
              backgroundColor="#5167A4"
              color="#fff"
              style={styles.free_places}
              title="Free places"
              onPress={() => this.getPlaces(this, this.setDebug)}
            />
          </View>
          {console.log(debug)}
          {debug !== "" && debug ? (
            <List containerStyle={{ marginBottom: 20 }}>
              {debug.map(
                l =>
                  l ? (
                    <ListItem
                      onPress={() => this.getPlaces(this, this.getUser, l)}
                      key={l.id}
                      title={l.id}
                    />
                  ) : null
              )}
            </List>
          ) : null}
        </Card>
      </ScrollView>
    );
  }
}

export default ProfileScreen;
