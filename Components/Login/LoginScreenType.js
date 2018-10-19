// @flow
import { NavigationScreenProp } from 'react-navigation';

export type State = {
  name: string,
  fname: string,
  id: string,
  place: string,
  historical: Array<object> | string,
  debug: Array<any> | string
};

export type Props = {
  navigation: NavigationScreenProp<{}>
};
