// @flow
/* eslint-disable */
import React from "react";

import { AsyncStorage, Image, ScrollView, View, Text } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import QRCodeScanner from "react-native-qrcode-scanner";
import config from "../../config/api";
import server from "../../config/server";
import styles from "./ProfileScreenStyles";
import picProfile from "../../assets/scan.png";
import { getPlaces, goTo, sendToServ } from "../../utils/utils";

import I18n from "../../i18n/i18n";
import ManualInsertionCard from "./components/ManualInsertionCard";
import HeaderCard from "./components/HeaderCard";

type Historical = {
  place_id: string,
  begin: string,
  end: string
};

type State = {
  name: string,
  fname: string,
  id: string,
  place: string,
  historical: Array<Historical>,
  debug: Array<any> | string,
  isWrongFormatPlace: boolean
};

type Props = {
  navigation: NavigationScreenProp<{}>
};

class ProfileScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: I18n.t("profile.title"),
    tabBarIcon: () => (
      <Image
        source={picProfile}
        resizeMode="contain"
        style={{ width: 20, height: 20 }}
      />
    )
  };

  _isMounted = false;

  constructor() {
    super();
    this.state = {
      name: "",
      fname: "",
      id: "",
      place: "",
      isWrongFormatPlace: false
    };
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    this._isMounted = true;
    // Fetch environment variables
    this.fetchAppMode();
    AsyncStorage.getItem("USER", (err, result) => {
      if (err || result === null) goTo(this, "Login");
      else {
        if (this._isMounted) {
          this.setState(JSON.parse(result));
          navigation.setParams(JSON.parse(result));
        }
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
            if (this._isMounted) {
              this.setState({ historical: data[0].historical || [] });
            }
          });
      }
    });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  onSuccess = e => {
    this.setState({ place: e.data });
    getPlaces(this, sendToServ);
  };

  fetchAppMode = async () => {
    const environment = await AsyncStorage.getItem("environment");
    this.setState({
      PLACE_REGEX: JSON.parse(environment).PLACE_REGEX
    });
  };

  // _handleRemote = async () => {
  //   await this.setState(prevState => ({ isRemote: !prevState.isRemote }));
  //   return getPlaces(this, sendToServ);
  // };

  render() {
    const {
      fname,
      name,
      id,
      place,
      PLACE_REGEX,
      isWrongFormatPlace
    } = this.state;

    return (
      <ScrollView style={styles.view}>
        <HeaderCard fname={fname} name={name} id={id} />
        {/* <CheckBox
          title={I18n.t("profile.remote")}
          checked={isRemote}
          onPress={this._handleRemote}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checkedColor="#5167A4"
          center
        /> */}
        {/* {!isRemote ? ( */}
        <View>
          {/* <ManualInsertionCard
              onChangeText={text => this.setState({ place: text })}
              onPress={() => {
                if (place !== "" && place.match(PLACE_REGEX) !== null) {
                  getPlaces(this, sendToServ);
                } else this.setState({ isWrongFormatPlace: true });
              }}
            />
            {isWrongFormatPlace ? (
              <Text style={styles.debug}>{I18n.t("profile.format")}</Text>
            ) : null}
            <QRCodeCard onPress={() => navigation.navigate("Scan")} /> */}
          <QRCodeScanner
            onRead={this.onSuccess}
            topContent={
              <Text style={{ marginBottom: 15 }}>
                {I18n.t("scan.scan_qr_code")}
              </Text>
            }
          />
          <View>
            <ManualInsertionCard
              onChangeText={text => this.setState({ place: text })}
              onPress={() => {
                if (place !== "" && place.match(PLACE_REGEX) !== null) {
                  getPlaces(this, sendToServ);
                } else this.setState({ isWrongFormatPlace: true });
              }}
            />
            {isWrongFormatPlace ? (
              <Text style={styles.debug}>{I18n.t("profile.format")}</Text>
            ) : null}
          </View>
        </View>
        {/* ) : null} */}
      </ScrollView>
    );
  }
}

export default ProfileScreen;
