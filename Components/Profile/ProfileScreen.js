// @flow
import React from 'react';
import {
  Button,
  Card,
  FormInput,
  Text,
  List,
  ListItem,
  SearchBar,
} from 'react-native-elements';

import {
 View, TextInput, AsyncStorage, ScrollView, Image 
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { filter, find, propEq } from 'ramda';
import config from '../../config/api';
import server from '../../config/server';
import styles from './ProfileScreenStyles';
import picProfile from '../../assets/profile.png';
import { sendToServ, getPlaces, goTo } from '../../utils/utils';

type State = {
  name: string,
  fname: string,
  id: string,
  place: string,
  search: string,
  historical: Array<object> | string,
  debug: Array<any> | string
};

type Props = {
  navigation: NavigationScreenProp<{}>
};

const profilePic = <Image source={require('../../assets/profile.png')} />

class ProfileScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: "Profile",
    tabBarIcon: ({ focused, tintColor }) => (
      <Image
        source={picProfile}
        resizeMode="contain"
        style={{ width: 20, height: 20 }}
      />
    )
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
      historical: "",
      users: []
    };
  }

  componentDidMount() {
    const { id } = this.state;
    AsyncStorage.getItem("USER", (err, result) => {
      if (err || result === null) goTo(this, "Login");
      else {
        this.setState(JSON.parse(result));
        const userId = JSON.parse(result).id;
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

  /** This function is used to attach the current user to a place  */
  getUser(ctx, element: object) {
    if (
      ctx.state.name !== "" &&
      ctx.state.fname !== "" &&
      ctx.state.id !== "" &&
      element.id !== ""
    ) {
      const { name, fname, id, historical } = ctx.state;
      ctx = ctx || window;

      const payload = {
        name,
        fname,
        id_user: id,
        id_place: element.id,
        historical
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
          let redirect: boolean = true;
          payload.id_place == element.id && element.using
            ? (redirect = false)
            : null;
          if (redirect) {
            AsyncStorage.setItem(
              "USER",
              JSON.stringify({
                name: payload.name,
                fname: payload.fname,
                id: payload.id_user,
                place: payload.id_place,
                debug: ctx.state.debug,
                historical: ctx.state.historical
              })
            );
            goTo(ctx, "Leave");
          }
        });
    }
  }

  render() {
    const navigation = this.props.navigation;
    const { fname, name, id, debug, users } = this.state;

    return (
      <ScrollView style={styles.view}>
        <View style={styles.view_second}>
          <Text h4 style={styles.text_first}>
            {fname}
            {' '}
            {name}
{' '}
[
{id}
]
</Text>
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
              onPress={() => getPlaces(this, sendToServ)}
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
      </ScrollView>
    );
  }
}

export default ProfileScreen
