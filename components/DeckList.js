import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View , TouchableOpacity} from 'react-native';
import { Platform } from 'react-native';
import { AppLoading } from 'expo';
// Components
import AppHeader from '../components/AppHeader';
import Deck from '../components/Deck';
import Quiz from '../components/Quiz';
// actionCreators, reducers, selectors, Api's
import { getDeckList, getFetchStatus } from '../store/decks/selectors';
import { receivedDecks } from '../store/decks/actionCreators';
import { fetchDecks } from '../utils/api';
// Constants, Helpers
import { white, gray, primaryColor } from '../utils/colors';
import { augmentStylesToVisualizeLayout } from '../utils/helpers';

 class DeckList extends React.Component {

  state = {
    isFetching: true,
    isFetchFailure: false,
  }

  canRenderData(){
    const { decks } = this.props;

    // I don't have anything (undefined, null)
    if (!decks) {return false}
    // I have either fresh or stale data
    if (decks && Array.isArray(decks) && (decks.length > 0)){
      return true;
    }
    //I have an empty array, and..
    if (this.state.isFetching)     {return false}
    if (this.state.isFetchFailure) {return false}  // coin toss

    // empty array returned from a fresh fetch
    return false;
  }

  componentDidMount(){
    const { decks } = this.props;

    // read data from localStore and dispatch/save to redux store
    const { dispatch } = this.props;

    fetchDecks()
      .then((decks) => dispatch(receivedDecks(decks)))
      .then(({ decks }) => this.setState({
        isFetching: false,
        isFetchFailure: false
      }))

      .catch(err => {
        dispatch(receiveDecksFailure(err))
        this.setState({
          isFetching: false,
          isFetchFailure: true,
        });
      });
  }

  render() {
    const decks = this.props.decks;
    const haveData = this.canRenderData();

    // but if have data from store, show it even while re-fetching
    // if (true){
    if (this.state.isFetching && !haveData){
        return (
          <View>
            {/* As Per docs - it's a blank screen, not a loading spinner */}
            <AppLoading />

            <AppHeader>
              {":-)"}
            </AppHeader>

            <View style={styles.item}>
              <Text style={styles.titleText}> Loading your data.. </Text>
            </View>

            <Text style={styles.infoText}>Loading your data..</Text>
          </View>
        );
    }

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

    if (!haveData){
      return (
        <View style={styles.container}>
          <AppHeader>
            Aww... No Decks..
          </AppHeader>

          <TouchableOpacity
            style={styles.item}
            onPress={() => this.props.navigation.navigate(
              'NewDeck',
            )}
            >
            <Text style={styles.titleText}>
              Create a New Deck
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
          <AppHeader>
            Select a Quiz Deck
          </AppHeader>

          {decks.map((deck) => {
            return (
              <TouchableOpacity
                style={styles.item}
                key={deck.id}
                onPress={() => this.props.navigation.navigate(
                  'Deck',
                  /* below passes in as: this.props.navigation.state.params.id*/
                  { id: deck.id, title: deck.title }
                )}
                >
                <Text
                  style={styles.titleText}
                  key={`${deck.id}-title`}
                  >
                  {deck.title}
                </Text>
                <Text
                  style={styles.infoText}
                  key={`${deck.id}-numQuestions`}
                  >
                  {deck.numCards} {`${deck.numCards===1?'Question':'Questions'}`}
                </Text>
              </TouchableOpacity>
            )
          })}
      </View>
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

function mapStoreToProps(store){
  const decks  = getDeckList(store) || null;

  return {
    decks,
  }
}

export default connect(mapStoreToProps)(DeckList);
