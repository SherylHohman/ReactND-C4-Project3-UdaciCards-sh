import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View , TouchableOpacity} from 'react-native';
import { Platform } from 'react-native';
import { AppLoading } from 'expo';
// Components
import Deck from '../components/Deck';
import Quiz from '../components/Quiz';
// actionCreators, reducers, selectors
import { getDeckList, getFetchStatus } from '../store/decks/selectors';
import { receivedDecks } from '../store/decks/actionCreators';
// Constants, Helpers, Api's
import { white, primaryColor, primaryColorDark } from '../utils/colors';
import { fetchDecks } from '../utils/api';

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
    return false
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
    if (this.state.isFetching && !haveData){
        return (
          <View>
            {/* As Per docs - it's a blank screen, not a loading spinner */}
            <AppLoading />
            <Text style={styles.noDataText}>Loading your data..</Text>
          </View>
        );
    }

    // but if have data from store, show it instead of fetching error
    if (this.state.isFetchFailure && !haveData) {
      return (
        <View style={styles.container}>
          <Text> There was an error retrieving your Saved Quizes </Text>
        </View>
      );
    }

    // TODO: make button for user to click on to create a NewDeck
    if (!haveData){
      return (
        <View style={styles.container}>
          <Text> You have no Saved Quiz Decks </Text>
          <TouchableOpacity> Create a New Deck </TouchableOpacity>
        </View>
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
                <Text
                  key={`${deck.id}-${deck.title}`}
                  style={styles.noDataText}
                  >
                  {deck.title}
                </Text>
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
  noDataText: {
    fontSize: 20,
    paddingTop:    12,
    paddingBottom: 10,
    marginBottom:  Platform.OS === 'ios' ? 12 : 10,
  },
  item: {
    margin: 10,
    backgroundColor: 'yellow',
  },
});

function mapStoreToProps(store){
  const decks  = getDeckList(store) || null;
  // const status = getFetchStatus(store);
  // console.log('+++store', store);
  // console.log('+++decks', decks);
  // console.log('status', status);

  return {
    decks,
    // status,
  }
}

export default connect(mapStoreToProps)(DeckList);
