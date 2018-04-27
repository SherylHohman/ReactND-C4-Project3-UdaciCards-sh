import React from 'react';
import { View, Text, TouchableOpacity,
         StyleSheet, Platform ,
       } from 'react-native';
// Components
import StyledButton from '../components/StyledButton';
// Constants, Helpers, Api's
import { clearLocalNotification, setLocalNotification } from '../utils/helpers';
import { white, gray, primaryColor, primaryColorDark,
         isCorrectColor, isIncorrectColor,
       } from '../utils/colors';

class Quiz extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { title } = navigation.state.params.deck;
    return { title: `${title} Quiz`}
  }

  state = {
    isQuestionView: true,
    index: 0,
    numCorrect: 0,
  }

  onCorrectAnswer() {
    let { index, numCorrect } = this.state;
    index++;
    numCorrect++;
    this.setState({ index, numCorrect, isQuestionView: true });
  }

  onIncorrectAnswer() {
    let { index, numCorrect } = this.state;
    index++;
    this.setState({ index, isQuestionView: true });
  }

  onResetQuiz() {
    let { index, numCorrect } = this.state;
    index = 0;
    numCorrect = 0
    this.setState({ index, numCorrect });
  }

  render() {
    const { deck } = this.props.navigation.state.params;

    // Error loading deck
    if (!deck){
      return (
          <View style={styles.container}>
            <Text  style={[
              styles.infoText,
              styles.label,
              {color: primaryColor, flex: 1, textAlign: 'center'},
              ]}
            >
            Uh Oh....{"\n\n"}
            I had trouble loading your {"\n"}
            {deck.title} Quiz !
            </Text>

            <TouchableOpacity
              style={[styles.item, style={flex: 3}]}
              onPress={() => this.props.navigation.navigate(
                'DeckList',
              )}
              >
              <Text style={[styles.titleText, {color: primaryColorDark}]}>
                Return to your List of Quizzes
              </Text>
            </TouchableOpacity>
          </View>
      );
    }

    const { title, id, questions } = deck;
    const numCards = questions.length;
    const { index, isQuestionView, numCorrect } = this.state;

    // No Questions in Deck
    if (numCards === 0){
      return (
          <View style={styles.container}>
            <View style={[styles.cardContainer, {flex: 1}]}>
              <Text  style={[
                styles.infoText,
                styles.label,
                {color: primaryColor, flex: 1, textAlign: 'center'},
                ]}
              >
              Oops..{"\n\n"}
              You Haven't added any Questions to your{"\n"}
              {title}  {"\n"}
              Quiz Deck Yet !
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.item, style={flex: 2}]}
              onPress={() => this.props.navigation.navigate(
                'NewCard',
                { id }
              )}
              >
              <Text style={[styles.titleText, {color: primaryColorDark}]}>
                Add a Question Card
              </Text>
            </TouchableOpacity>
          </View>
      );
    }

    // TODO: keep track of incorrect questions
    //       then give user the option to review just those cards
    //       ...hmm maybe rank number of passes it takes to get 100%
    //       ..or simply a Congrats! message once completed All correctly
    //       Score: sum total of number of views (count each repeat)
    //         score is numCards/totalViews - takes into account repeatViews
    //         maybe, successive views are weighted differently ??
    //         eg: 1 wrong twice is different than 2 wrong once ?
    //         (extrapolate the numbers to find a more relevant example)

    // Finished Completed the Quiz !
    if (index >= numCards){

      // CLEAR today's REMINDER NOTIFICATION, Set Tomorrow's
      clearLocalNotification()
        .then(setLocalNotification)
        // TODO: Why is `setLocalNotification` not _invoked_ ??
        //    Also, why not using .then(()=>{}) ??
        //    Are these two Questions related ?
        .catch((err) => {
          console.log('Quiz.render - error clearing or setting localNotifications: ', err);
          console.error(err);
        })

      // show quiz results (Score)
      return(
        <View style={styles.container}>

          {/* Score */}
          <View style={[styles.cardContainer, {flex: 1}]}>
            <Text  style={[styles.infoText, styles.label, {color: primaryColor}]}>
            You got {numCorrect} Correct out of {numCards}
            </Text>

            <Text style={[styles.titleText, {fontSize: 35}]}>
            {'   ' + Math.round(100 * numCorrect / numCards).toString()} %
            </Text>
          </View>

          {/* Nav Buttons */}
          <View style={[styles.buttonsContainer, {flex: 3}]}>
            <TouchableOpacity
              onPress={() => {this.onResetQuiz()}}
              style={styles.buttonContainer}
              >
              <Text style={[styles.infoText,{color: primaryColorDark}]}>
              Redo This Quiz
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate(
              'DeckList',
              )}
              style={styles.buttonContainer}
              >
              <Text style={[styles.infoText,{color: primaryColorDark}]}>
              Return to List of Quiz Decks
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      )
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
              onPress={() => {this.onCorrectAnswer()}}
              customColor={isCorrectColor}
              >
              I Got This Right !!
              </StyledButton>
            </View>

            {/* Mark as InCorrect */}
            <View style={styles.buttonContainer}>
              <StyledButton
              onPress={() => {this.onIncorrectAnswer()}}
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

      </View> /* end container */
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
    marginBottom: 20,
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

export default Quiz;
