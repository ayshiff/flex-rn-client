import React from "react";
import { View, AsyncStorage } from "react-native";

import {
  Button,
  Card,
  FormInput,
  Text,
  List,
  ListItem,
  SearchBar
} from "react-native-elements";
import styles from "./LoginScreenStyles";
import server from "../../config/server";
import config from "../../config/api";
import { omit } from 'ramda';

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: "Login"
  };

  constructor() {
    super();
    this.state = {
      name: "",
      fname: "",
      id: "",
      place: "",
      debug: "",
      historical: "",
    };
  }

  logOut() {
    AsyncStorage.removeItem("USER");
  }

  /** This function handle the user login */
  logIn() {
    const { navigation } = this.props;
    if (
      this.state.name !== "" &&
      this.state.fname !== "" &&
      this.state.id !== ""
    ) {
      let payload = {
        name: this.state.name,
        fname: this.state.fname,
        id_user: this.state.id,
        id_place: '',
        historical: this.state.historical,
      };

      AsyncStorage.setItem("USER", JSON.stringify(this.state));
      fetch(server.address + "/login_user", {
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

          if (redirect) {
            AsyncStorage.setItem("USER", JSON.stringify(omit('debug', this.state)));
            console.log("REDIRECT Profile")
            navigation.goBack();
            navigation.navigate("Profile");
          }
        });
    } else {
      this.setState({ debug: "Fill all inputs" });
    }
  }

  render() {
    const { debug } = this.state;
    return (
      <View style={styles.view}>
        <View style={styles.view_second}>
          <FormInput
            style={styles.textInput}
            placeholder="Nom"
            onChangeText={text => this.setState({ name: text })}
          />

          <FormInput
            style={styles.textInput}
            placeholder="Prénom"
            onChangeText={text => this.setState({ fname: text })}
          />

          <FormInput
            style={styles.textInput}
            placeholder="ID"
            onChangeText={text => this.setState({ id: text })}
          />
          <View style={styles.button_container}>
            <Button
              style={styles.button_login}
              fontWeight="bold"
              borderRadius={15}
              backgroundColor="#5167A4"
              color="#fff"
              title="Login"
              onPress={() => this.logIn()}
            />
          </View>

          <Text>{debug}</Text>
        </View>
      </View>
    );
  }
}
/* <Button title='Log out'
onPress={() => this.logOut()}/> */
export default LoginScreen;
