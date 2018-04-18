import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// Components
import Deck from     '../components/Deck';
import Quiz from     '../components/Quiz';
// Constants, Helpers, Api's
import { white, primaryColor, primaryColorDark } from '../utils/colors';

export default class DeckList extends React.Component {
  render() {
    return (
      <View style={styles.container}>
          <Text>Welcome to UdaciCards !!</Text>
          <Text> by Sheryl Hohman </Text>
          <Text> {"\n\n"} </Text>

          <Text> Deck List Page </Text>
          <Deck />
          <Quiz />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
