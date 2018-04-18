import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// Components
import NewCard from  '../components/NewCard';
// Constants, Helpers, Api's
import { white, primaryColor, primaryColorDark } from '../utils/colors';


export default class NewDeck extends React.Component {
  render() {
    return (
      <View style={styles.container}>
          <Text>New Deck Page</Text>
          <NewCard />
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
