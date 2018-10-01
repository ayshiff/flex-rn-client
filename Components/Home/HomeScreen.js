import React from 'react';
import { TouchableOpacity, View, Text, Button } from 'react-native';
import { AsyncStorage } from 'react-native';
import styles from './HomeScreenStyles';

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
        let jsonres = JSON.parse(result);
        if(jsonres.place == null || jsonres.place == '')
          navigate('Profile');
        else
          navigate('Leave');
      }
    });
  }

  render() {

    return (
      <View style={styles.view}>
        <Button
          style={styles.button}
          title='Main Page'
          color="#000"
          onPress={() => this.componentDidMount()}/>
      </View>
    )
  }
}

export default HomeScreen;
