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

// dev  TODO: only enable this import (and its invocation) while in dev
import { augmentStylesToVisualizeLayout } from '../utils/helpers';


class Deck extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params.deck;
    return { title: `Quiz Deck: ${title}`}
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
    // TODO:
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

        <View style={[{paddingTop:20, paddingBottom:20}]}>
          <Text style={styles.titleText}>{deck.title}</Text>
          <Text style={styles.infoText}>
          {numCards} {(numCards === 1) ? 'Question' : 'Questions'}
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
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

          {/* btn: Home (DeckList) */}
            <StyledButton
              customColor={primaryColorLight}
              onPress={() => this.props.navigation.navigate('Home')}
              >
              Home (Quiz Deck List)
            </StyledButton>

          {/* btn: Delete Deck */}
            {/* TODO: Verification:
                1)Modal "Are You Sure OR
                2)TextInput type "Delete" to verify.
           */}
            <StyledButton
              customColor='#rgba(255, 0, 0, 0.5)'
              onPress={() => this.onDelete()}
              >
              Delete (Cannot be Undone)
            </StyledButton>
          </View>

      </View>
    );
  }
}


let componentStyles = {
  // CONTAINER styles
  container: {
    flex: 1,
    backgroundColor: white,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  cardContainer: {
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
  buttonsContainer: {
    flex: 9,
    alignSelf: 'stretch',
    justifyContent: 'space-around',
  },
  buttonContainer: {
    justifyContent: 'center',
    margin: 10,
  },
  // TEXT Styles
  titleText: {
    fontSize: 27,
    color: primaryColor,
    alignSelf: 'center',
  },
  infoText: {
    fontSize: 20,
    color: primaryColorDark,
    alignSelf: 'center',
  },
};


// TODO: use below to modify styles to better match DeckList, NewDeck, NewCard

const viewStyleLayout = false;
  // set to `false` for normal view, and production.
  // set to `true`  to troubleshoot/test/visualize style layouts
  //         Adds border outlines to styles to aid in UI layout design
  //         Use only temporarily for editing styles/layout/UI-design.
  if (viewStyleLayout) {componentStyles = augmentStylesToVisualizeLayout(componentStyles);}


const styles = StyleSheet.create({
  ...componentStyles,
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
