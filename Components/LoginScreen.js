import React from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { AsyncStorage } from 'react-native';

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
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View style={{
          width:250,
          marginBottom:50,
        }}>
          <TextInput style={{
            borderRadius: 4,
            borderWidth: 0.5,
            margin:5,
          }}
           placeholder="Nom"
           onChangeText={(text) => this.setState({name:text})}
          />

          <TextInput style={{
            borderRadius: 4,
            borderWidth: 0.5,
            margin:5,
          }}
            placeholder="Prénom"
            onChangeText={(text) => this.setState({fname:text})}
          />

          <TextInput style={{
            borderRadius: 4,
            borderWidth: 0.5,
            margin:5,
          }}
            placeholder="ID"
            onChangeText={(text) => this.setState({id:text})}
          />
          <View style={{
            marginTop:10,
          }}>
            <Button title='Login'
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
