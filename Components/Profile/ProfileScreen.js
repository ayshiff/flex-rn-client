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
import { NavigationScreenProp } from 'react-navigation'
import { filter } from 'ramda';

type State = {
  name: ?string,
  fname: ?string,
  id: ?string,
  place: ?string,
  debug: ?array
};

type Props = {
  navigate: NavigationScreenProp<{}>,
};

class ProfileScreen extends React.Component<Props, State> {
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
      debug: "",
      search: "",
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

  /** This function is used to send a new place to the server */

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

  /** This function is used to get the places from the server */
  getPlaces(ctx, fn, l = null) {
    ctx = ctx || window;

    fetch(server.address + "places/", {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-access-token": config.token
      }
    })
      .then(res => res.json()) // transform data to json
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

  _handleSearch = search => {
    this.setState({ search });
  };

  _handleList = () => {
    const { debug, search } = this.state;

    const newT =
      debug !== ""
        ? debug.filter(e => {
            let finalResult = true;
            for (let element in search) {
              if (search[element] !== e.id[element]) {
                finalResult = false;
              }
            }
            return finalResult;
          })
        : debug;
    return search === "" ? debug : newT;
  };

  /** This function is used to attach the current user to a place  */
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
          <SearchBar
            onChangeText={this._handleSearch}
            round
            lightTheme
            platform="ios"
            containerStyle={{
              backgroundColor: "white",
              borderWidth: 0,
              marginTop: 10
            }}
            searchIcon={{ size: 24 }}
            placeholder="Search a place..."
          />
          {debug !== "" && debug ? (
            <List containerStyle={{ marginBottom: 20 }}>
              {this._handleList().map(
                item =>
                  item ? (
                    <ListItem
                      onPress={() => this.getPlaces(this, this.getUser, item)}
                      key={item.id}
                      title={item.id}
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
