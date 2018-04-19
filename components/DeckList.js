import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// Components
import Deck from     '../components/Deck';
import Quiz from     '../components/Quiz';
// Constants, Helpers, Api's
import { white, primaryColor, primaryColorDark } from '../utils/colors';
import { fetchDecks } from '../utils/api';

export default class DeckList extends React.Component {

  // temp
  state = {
    decks: null,
  }

  componentDidMount(){
    fetchDecks()
      .then( (appData) => {
        console.log('appData:', appData);

        // temp so I can render/see the data
        if (appData && (typeof appData === 'object') && !Array.isArray(appData)) {
          const decks = Object.keys(appData).reduce((acc, id) => {
            return acc.concat([{ id, title: appData[id].title }]);
          }, []);
          this.setState({ decks });
        }

      })
      .catch((err) => {
        console.log('error fetching data in DeckList, cDM, err:', err);
      })
  }

  render() {
    const decks = this.state.decks;

    if (!this.state.decks || !(this.state.decks.length > 0)) {
      // TODO: proper loading message/spinner that resolves on fetch failure
      return (
        <Text> Fetching Quiz Decks </Text>
      );
    }

    return (
      <View style={styles.container}>
          <Text>Welcome to UdaciCards !!</Text>
          <Text> by Sheryl Hohman </Text>
          <Text> {"\n\n"} </Text>

          <Text> Available Quiz Decks: </Text>
          {decks.map((deck) => {
            return (
              <View key={deck.id} style={styles.item}>
                <Text>{deck.title}</Text>
              </View>
            )
          })}
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
  item: {
    margin: 10,
    backgroundColor: 'yellow',
  },
});
