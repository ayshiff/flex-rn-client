import React from 'react';
import { TouchableOpacity, View, Text, Button } from 'react-native';
import { AsyncStorage } from 'react-native';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

  componentDidMount(){
    const navigate = this.props.navigation.navigate;

    AsyncStorage.getItem('USER', (err, result) => {
      if(err || result == null)
        navigate('Login');
      else
      {
        var jsonres = JSON.parse(result);
        if(jsonres.place == null || jsonres.place == '')
          navigate('Profile');
        else
          navigate('Leave');
      }
    });
  }

  render() {
    const navigate = this.props.navigation.navigate;

    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>

        <Button
          title='Main Page'
          color="#000"
          onPress={() => this.componentDidMount()}/>
      </View>
    )
  }
}

export default HomeScreen;
