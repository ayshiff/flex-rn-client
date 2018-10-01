import React from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { AsyncStorage } from 'react-native';
import styles from './LoginScreenStyles';

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login',
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

  _logOut() {
    AsyncStorage.removeItem('USER');
  }

  _logIn() {
    if(this.state.name != '' && this.state.fname != '' && this.state.id != '')
    {
      AsyncStorage.setItem('USER', JSON.stringify(this.state));
      this.setState({debug:'OK'});
      const navigation = this.props.navigation;
      navigation.goBack();
      navigation.navigate('Profile');
    }
    else {
      this.setState({debug:'Fill all inputs'});
    }
  }

  render() {
    return (
      <View style={styles.view}>
        <View style={styles.view_second}>
          <TextInput style={styles.textInput}
           placeholder="Nom"
           onChangeText={(text) => this.setState({name: text})}
          />

          <TextInput style={styles.textInput}
            placeholder="Prénom"
            onChangeText={(text) => this.setState({fname: text})}
          />

          <TextInput style={styles.textInput}
            placeholder="ID"
            onChangeText={(text) => this.setState({id: text})}
          />
          <View style={styles.button_container}>
            <Button style={styles.button_login} title='Login'
            color="#000"
            onPress={() => this._logIn()}/>
          </View>


          <Text>{this.state.debug}</Text>
        </View>
      </View>
    );
  }
}
/*<Button title='Log out'
onPress={() => this._logOut()}/>*/
export default LoginScreen
