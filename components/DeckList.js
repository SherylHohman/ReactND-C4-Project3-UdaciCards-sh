import React from 'react';
import { StyleSheet, Text, View , TouchableOpacity, ScrollView, Platform
       } from 'react-native';
import { AppLoading } from 'expo';
// Components
import AppHeader from '../components/AppHeader';
import Deck      from '../components/Deck';
import Quiz      from '../components/Quiz';
// Constants, Helpers, Api's
import { retrieveDecks }                     from '../utils/api';
import { augmentStylesToVisualizeLayout } from '../utils/helpers';
import { white, gray, primaryColor }      from '../utils/colors';

 // class DeckList extends React.Component {
 class DeckList extends React.Component {

  state = {
    // decks is a convenience variable only; not expected to change
    decks: null,
    isFetching: true,
    isFetchFailure: false,
  }

  canRenderData(){
    const decks = this.state.decks;

    // I don't have anything (undefined, null, '')
    if (!decks) {return false}

    // I have either fresh or stale data
    if (decks && Array.isArray(decks)){
      return decks.length === 0
        ? false  // empty array is legit, but cannot render it
        : true;  // have data !!
    }

    // console.log('____DeckList.canRenderData____, have invalid dataType for decks:', decks);
    return false;
  }

  componentDidMount(){

    // read data from localStore
    retrieveDecks()

      .then((decksObj) => {
        // Object to Array of Decks
        const decks = Object.keys(decksObj).map((deckId) => {
          return decksObj[deckId]
        });
        this.setState({
          decks,
          isFetching: false,
          isFetchFailure: false
        });
      })

      .catch(err => {
        this.setState({
          isFetching: false,
          isFetchFailure: true,
        });
      });
  }

  render() {
    const decks = this.state.decks;
    const haveData = this.canRenderData();

    // fetching data,
    // but if have data from store, show data from store, even while re-fetching
    if (this.state.isFetching && !haveData){
        return (
          <View>
            {/* As Per docs - it's a blank screen, not a loading spinner */}
            <AppLoading />

            <AppHeader>
              {":-)"}
            </AppHeader>

            <View style={styles.item}>
              <Text style={styles.titleText}> Loading your Quiz Decks.. </Text>
            </View>

            <Text style={styles.infoText}>Loading your Quiz Decks..</Text>
          </View>
        );
    }

    // fetch error,
    // but if have data from store, show it instead of fetching error
    if (this.state.isFetchFailure && !haveData) {
      return (
          <View style={styles.container}>
            <AppHeader>
            </AppHeader>

            <View style={styles.item}>
              <Text style={styles.titleText}>Uh Oh..</Text>
            <Text style={styles.infoText}>I Could Not Find Your Quiz Decks !</Text>
            </View>
        </View>
      );
    }

    // No Quiz Decks
    if (!haveData){
      return (
        <View style={styles.container}>
          <AppHeader>
            Aww... No Quiz Decks..
          </AppHeader>

          <TouchableOpacity
            style={styles.item}
            onPress={() => this.props.navigation.navigate(
              'NewDeck',
              {decks: []} /* so can enforce unique titles */
            )}
            >
            <Text style={styles.titleText}>
              Create a New Deck
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Show Quiz Deck List
      // <View style={styles.container}>
    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
          <AppHeader>
            Select a Quiz Deck
          </AppHeader>

          {decks.map((deck) => {
            const id = deck.title;
            const numCards = deck.questions.length;
            return (
              <TouchableOpacity
                style={styles.item}
                key={id}
                onPress={() => this.props.navigation.navigate(
                  'Deck',
                  /* below passes in as: this.props.navigation.state.params.id*/
                  { deck }
                )}
                >
                <Text
                  style={styles.titleText}
                  key={`${id}-title`}
                  >
                  {deck.title}
                </Text>
                <Text
                  style={styles.infoText}
                  key={`${id}-numQuestions`}
                  >
                  {numCards} {`${numCards===1?'Question':'Questions'}`}
                </Text>
              </TouchableOpacity>
            )
          })}
      </ScrollView>
    );
  }
}

let componentStyles = {
  container: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    flex: 1,
    height: 75,
    justifyContent: 'center',
    alignSelf:      'stretch',
    alignItems:     'center',
    backgroundColor: white,
    padding:     20,
    marginLeft:  10,
    marginRight: 10,
    marginTop:   10,
    borderRadius: Platform.OS === 'ios' ? 20 : 10,

    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0, 0, 0, 0.24)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    marginBottom:  Platform.OS === 'ios' ? 12 : 10,
  },

  // Text only inherits these styles from other Text components (limited inheritance)
  titleText: {
    fontSize: 27,
    color: primaryColor,
  },
  infoText: {
    fontSize: 20,
    color: gray,
  },
};

// set to `false` for normal view, and production.
// set to `true`  to troubleshoot/test/visualize style layouts
//         Adds border outlines to styles to aid in UI layout design
//         Use only temporarily for editing styles/layout/UI-design.
const viewStyleLayout = false;
if (viewStyleLayout) {componentStyles = augmentStylesToVisualizeLayout(componentStyles);}

const styles = StyleSheet.create({
  ...componentStyles,
});

export default DeckList
