import React from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity,
         StyleSheet, Platform ,
       } from 'react-native';
// Components
import StyledButton from '../components/StyledButton';
// actionCreators, reducers, selectors
import { getDeck, getCards } from '../store/decks/selectors';
import {
  white, gray, primaryColor, primaryColorDark, isCorrectColor, isIncorrectColor,
} from '../utils/colors';

class Quiz extends React.Component {

  static navigationOptions = ({ navigation }) => {
    // TODO: use the actual title instead of id
    // TODO: can I also put current card index here too? I think not, but verify..
    const { id } = navigation.state.params;
    return { title: `${id} Quiz`}
  }

  state = {
    isQuestionView: true,
    index: 0,
    numCorrect: 0,
  }

  render() {
    const { title, id, questions } = this.props.deck;
    const numCards = questions.length;
    const { index, isQuestionView } = this.state;

    // show error message
    if (false){
      // TODO
    }

    // show quiz results
    if (index >= this.props.numcards){
      // TODO
    }

    // show quiz
    // TODO: wrapped long lines of txt (long Questions/Answers) do NOT center !
    return (
      <View style={styles.container}>
        <View style={styles.everythingExceptProgressBar}>

          <View style={styles.cardContainer}>
            <View style={styles.label}>
              {isQuestionView
                /* Heading: "Question" or "Answer" */
                  ? <Text style={[styles.infoText,{color: primaryColorDark}]}>Question:</Text>
                  : <Text style={[styles.infoText,{color: primaryColorDark}]}>Answer:</Text>
              }
            </View>

            <View>
              {isQuestionView
                /* The Question or The Answer */
                ? <Text style={styles.titleText}>{questions[index].question}</Text>
                : <Text style={styles.titleText}>{questions[index].answer}</Text>
              }
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={() => {this.setState({ isQuestionView: !isQuestionView })}}
              style={styles.label}
              >
              {isQuestionView
                /* button to show The Question, or The Answer */
                ? <Text style={[styles.infoText,{color: primaryColorDark}]}>(view Answer)</Text>
                : <Text style={[styles.infoText,{color: primaryColorDark}]}>(view Question)</Text>
              }
            </TouchableOpacity>

            {/* Mark as Correct */}
            <View style={styles.buttonContainer}>
              <StyledButton
              onPress={() => {}}
              customColor={isCorrectColor}
              >
              I Got This Right !!
              </StyledButton>
            </View>

            {/* Mark as InCorrect */}
            <View style={styles.buttonContainer}>
              <StyledButton
              onPress={() => {}}
              customColor={isIncorrectColor}
              >
              I need to Study This One
              </StyledButton>
            </View>

          </View>
        </View>

        {/* Quiz Progress Bar */}
        <View style={styles.progressBarContainer}>
          <Text style={styles.infoText}>{index}/{numCards}</Text>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    paddingTop: 30,
    paddingBottom: 5,
  },
  everythingExceptProgressBar: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: white,
  },

  // item: {
  cardContainer: {
    flex: 8,
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
    alignItems: 'stretch',
    backgroundColor: '#fefefe',

    padding:     20,
    marginLeft:  30,
    marginRight: 30,
    marginTop:   10,
    borderRadius: Platform.OS === 'ios' ? 20 : 10,

    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0, 0, 0, 0.24)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    marginBottom:20,
  },
  titleText: {
    fontSize: 27,
    color: primaryColor,
    alignSelf: 'center',
    flexWrap: 'wrap',
    textAlign: 'center',
    // Styling on android buttons uses colored backgrounds.
    // These large blocks of solod color cause eyes to be drawn naturally to the buttons.
    // Questions/Answers, *should* take the users/eyes main focus.
    // make Q/A text bolder on android, to minimize this competition.
    // Eyes now naturally drawn to Q/A, rather than buttons !
    fontWeight: Platform.OS === 'ios' ? 'normal' : 'bold',
  },
  infoText: {
    fontSize: 20,
    color: gray,
    alignSelf: 'center',
  },

  buttonsContainer: {
    flex: 10,
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
  },
  label: {
    marginBottom: 20,
  },
  buttonContainer: {
    justifyContent: 'center',
    margin: 10,
  },

  progressBarContainer: {
    height: 30,
    flexDirection: 'row',
  },
  // TODO: Progress Box (numCards Boxes. cardIndex+1 boxes filled in)
  // progressBox: {},
});

function mapStoreToProps(store, ownProps){
  console.log(ownProps);
  const deck  = getDeck(store, ownProps.navigation.state.params.id) || null;

  return {
    deck,
  }
}

export default connect(mapStoreToProps)(Quiz);
