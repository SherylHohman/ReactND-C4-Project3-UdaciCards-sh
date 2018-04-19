import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View , TouchableOpacity} from 'react-native';
import { Platform } from 'react-native';
import { AppLoading } from 'expo';
// Components
import AppHeader from '../components/AppHeader';
import Deck from '../components/Deck';
import Quiz from '../components/Quiz';
// actionCreators, reducers, selectors
import { getDeckList, getFetchStatus } from '../store/decks/selectors';
import { receivedDecks } from '../store/decks/actionCreators';
// Constants, Helpers, Api's
import { white, gray, primaryColor } from '../utils/colors';
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

          <Text style={styles.headingText}>
            Select a Quiz Deck:
          </Text>

    // temp
    const tempCardCount = 5;
    return (
      <View style={styles.container}>
          <AppHeader>
            Select a Quiz Deck
          </AppHeader>

          {decks.map((deck) => {
            return (
              <View
                style={styles.item}
                key={deck.id}
                >
                <Text
                  style={styles.titleText}
                  key={`${deck.id}-${deck.title}`}
                  >
                  {deck.title}
                </Text>
                <Text
                  style={styles.infoText}
                  key={`${deck.id}-${tempCardCount}`}
                  >
                  {tempCardCount} Questions
                </Text>
              </View>
            )
          })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // card: {
  //   flex: 1,
  //   backgroundColor: white,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   alignSelf: 'stretch',
  //   marginBottom: 10,
  // },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
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
    // so bottom background of UdaciFitnessCalendar does Not get Cut Off
    // (difference in numbers accounts for shadow on ios)
    marginBottom:  Platform.OS === 'ios' ? 12 : 10,
  },

  // Text does not inherit styles (such as color), except from parent Text
  titleText: {
    fontSize: 27,
    color: primaryColor,
  },
  infoText: {
    fontSize: 20,
    color: gray,
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
