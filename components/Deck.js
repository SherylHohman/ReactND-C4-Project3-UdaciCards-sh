import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Platform,
       } from 'react-native';
import PropTypes from 'prop-types';
// Components
import StyledButton from '../components/StyledButton';
import * as storageAPI from '../utils/api';
// Constants, Helpers
import { white, gray, primaryColor, primaryColorLight, primaryColorDark,
         isCorrectColor, isIncorrectColor
       } from '../utils/colors';

class Deck extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params.deck;
    return { title: `${title} Quiz Deck`}
  }

  state = {
    // convenience variable only;
    // not expected to change after it is set (in componentDidMount)
    deck: {
      title: 'placeholder, overwritten at cDM. title doubles as id in decks object.',
      questions: [{
          question: 'Why?',
          answer:   'cDM First Render.. safeguard. Also shows format of deck object',
      }]
    }
  }

  componentDidMount(){
    console.log('\n __Decks.cDM__, this.props:', this.props, '\n');
    // for convenience
    const deck = this.props.navigation.state.params.deck;
    this.setState({ deck });
  }

  onRename(){
    // console.log('in onRename');
    // // update DB
    // storageAPI.updateDeckTitle()
    //   .then
    // //   update Store
    // //   navigate to Home
  }

  onDelete(){
    const id = this.state.deck.title;
    console.log('____Deck.js____, onDelete, deck id:', id);

    // update DB
    storageAPI.removeDeck(id)
    .then((decks) => {
      // since not using redux, must put navigation inside `.then`
      // to gaurantee Storage has been updated before loading the page.
      // since it "fetches" at cDM, and there is no mSTP/cWRP/props to catch
      // updates to the data update.
      this.props.navigation.navigate('Home');
    })

    .catch((err) => {
      console.log('____error____ removing id id:', id);
      // opting to navigate even if there is an error.
      // perhaps better to render an error message, and Home Button.
      this.props.navigation.navigate('Home');
    })
  }

  render() {
    if (!this.state.deck){
      return (
        <View>
          <Text> There was an error loading you Deck..</Text>
          <StyledButton>
            Home
          </StyledButton>
        </View>
      );
    }
    const { deck } = this.state;
    const numCards = deck.questions.length;

    return (
      /* Deck Info */
      <View style={styles.container}>
        <View>
          <Text style={styles.titleText}>Deck: {deck.title}</Text>
          <Text style={styles.infoText}>
          {numCards} {(numCards === 1) ? 'Question' : 'Questions'}
          </Text>
        </View>

        {/* btn: Take Quiz btn*/}
        <StyledButton
          customColor={isCorrectColor}
          onPress={() => this.props.navigation.navigate(
            'Quiz',
            /* below passes in as: this.props.navigation.state.params.deck*/
            { deck }
          )}
        >
        Take Quiz !
        </StyledButton>

        {/* btn: Add a new Question/Answer Card */}
        <StyledButton
          customColor={primaryColor}
          onPress={() => this.props.navigation.navigate(
            'NewCard',
            /* below passes in as: this.props.navigation.state.params.deck*/
            { deck }
          )}
        >
        Add a New Question
        </StyledButton>

        {/* btn: Rename Deck */}
      {/* TODO: Implement..
      <StyledButton
          customColor={primaryColor}
          onPress={() => this.onRename()}
        >
        Rename
        </StyledButton>
      */}

        {/* btn: Edit Cards */}
      {/* TODO: Implement..
      <StyledButton
          customColor={primaryColor}
          onPress={() => navigateToCardListScreen (does not exist yet) }
        >
        Edit Question/Answer Cards
        </StyledButton>
      */}

        {/* btn: Delete Deck */}
          <StyledButton
            customColor='#rgba(255, 0, 0, 0.5)'
            onPress={() => this.onDelete()}
            >
            Delete (Cannot be Undone)
          </StyledButton>
      </View>
    );
  }
}


// // TODO: adjust styles to resemble Quiz.
// //   use below to help with alignment.
// const testing = false;
// const borderWidth = testing ? 2 : 0;

//     //TEMP
//     borderColor: 'red'  (containers)
//     borderWidth,
//     borderColor: 'blue' (text)
//     borderWidth,

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  titleText: {
    fontSize: 27,
    color: primaryColor,
    alignSelf: 'center',
  },
  infoText: {
    fontSize: 20,
    color: gray,
    alignSelf: 'center',
  },
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
  },
});

Deck.propTypes = {
  // - props.navigation.navigate
  // - props.navigation.state.params.deck
  //      { deck.title,
  //        deck.questions: [
  //          deck.question,
  //          deck.answer     // not needed!
  //        }]
  //       }
    navigation: PropTypes.shape({
      navigate:   PropTypes.func.isRequired,
      state:      PropTypes.shape({
        params:     PropTypes.shape({
          deck:       PropTypes.shape({
            title:      PropTypes.string.isRequired,
            questions:   PropTypes.arrayOf(PropTypes.shape({
              question:    PropTypes.string,
              answer:      PropTypes.string,
            })).isRequired
          }).isRequired
        }).isRequired,
      }).isRequired,
  }).isRequired,
}

export default Deck;

// TODO propTypes: deck, navigation
