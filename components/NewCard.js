import React from 'react';
import { View, Text, TouchableOpacity,
         TextInput, KeyboardAvoidingView, ScrollView,
         StyleSheet, Platform,
       } from 'react-native';
// Components
import StyledButton from '../components/StyledButton';
// Constants, Helpers, Api's
import { retrieveDecks }    from '../utils/api';
import { saveCard } from '../utils/api';
// Constants, Helpers
import { titleCase, collapseSpaces, makeStringUnique }
  from '../utils/helpers';
import { white, gray, primaryColor, primaryColorDark, primaryColorLight,
       } from '../utils/colors';

// dev  TODO: enly enable this import and its usage while in dev
import { augmentStylesToVisualizeLayout } from '../utils/helpers';


class NewCard extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { deck } = navigation.state.params;
    return { title: `${deck.title}`}
  }

  state = {
    question: '',
    answer:   '',
    isValid: {
      question: false,
      answer:   false,
    },

    // not expected to change after component mounts
    // (if using redux, these would be props instead, and set by selectors in mSTP)
    deck: null,
    existingQuestions: [],

    textInputContainerWidth: undefined,
  }

componentDidMount () {
  //TODO: fetchDecks in App.js instead, and pass decks in to via TabNavigator
  //      (to both tabs: NewDeck -and- DeckList)

  // deck should be passed in
  let deck = (this.props.navigation &&
               this.props.navigation.state.params &&
               this.props.navigation.state.params.deck) || undefined;
  let questions = (deck && deck.questions) || undefined;

  if (deck && questions) {
      const existingQuestions = questions.map( questionObj => questionObj.question );
      this.setState({ deck, existingQuestions });
  }
  else {
    console.log('NewCards.cDM, ERROR: did not receive deck, or there is an error with its questions, deck:', deck);
  }

  // another attempt to get focus into TextInput, and keyboard to pop up at cDM !
  // this.textInputRef.focus()
}

getWidth = event => {
  // gets dimensions of View containing TextInputs,
  //    so can set the TextInput equal to the width of their containing component
  //    The value is calculated During FIRST render,
  //    Then during SECOND render, the TextInput can use the values in state
  //      to set their own width

  // (this is SECOND render) layout was already called, and width has been set
  if (this.state.textInputContainerWidth) return

  // FRIST render sets width
  let { width } = event.nativeEvent.layout;
  width = width - styles.cardContainer.paddingLeft - styles.cardContainer.paddingRight;
  this.setState({textInputContainerWidth: width});
}

  controlledTextInputQuestion(text){
    // no need to strip characters, as it is never used as an object/DB "key"

    text = collapseSpaces(text);

    const isValid = this.isValidInput(text);
    this.setState((prevState) => {
      return {
        question: text,
        isValid: {
          ...prevState.isValid,
          question: isValid,
        },
      }
    });
  }
  controlledTextInputAnswer(text){
    // no need to strip characters, as it is never used as an object/DB "key"
    text = collapseSpaces(text);

    const isValid = this.isValidInput(text);
    this.setState((prevState) => {
      return {
        answer: text,
        isValid: {
          ...prevState.isValid,
          answer: isValid
        }
      }
    });
  }

  isValidInput(text){
    // TODO: show "field cannot be empty" message to user.
    // TODO: check for unique question, and require user to edit it if not.
    // TODO: show "question already exists" message to user, and disable Submit button
    //       rather than silently appending a number to the question
    return collapseSpaces(text).trim() !== '';
  }

  onBlur(){
    // question = this.state.question.trim();
    // const unique = makeStringUnique(question, this.props.existingTitles);

    // // TODO: if unique !== question, highlight this to the user, so they can edit
    // //       if they don't like the revised question

    // this.setState({ question: unique });
  }

  canSubmit(){
    return Object.values(this.state.isValid).every(value => value===true);
    // TODO also: require every question to be unique
  }

  onSubmit(){
    // TODO: close keyboard, so it's closed on the next screen

    if (!this.canSubmit()) {return;}
    const { deck, existingQuestions, isValid } = this.state;
    let   question = this.state.question.trim();
    const answer   = this.state.answer.trim();

    // it is not strictly a requirement for questions to be unique - they are not
    //    not used as keys anywhere. -But, it certainly makes it difficult to score
    //    well on a quiz if the same question has more than 1 answer, and the user
    //    has no way to tell which version of the answer is expected.
    //    Thus for a minimum UX, suffix an identifying digit behind duplicated quesitons.
    question = makeStringUnique(question, existingQuestions)

    // send to "DB"
    saveCard(deck, { question, answer })
      .then((deck)=>{

        // TODO: put keyboard away !

        // if was using redux, could navigate without waiting on a `then`..
        //  since I'm not,  must get updated value for deck from AsyncStorage
        this.props.navigation.navigate('Deck', { deck });
      })

      .catch((err) => {
        console.log('____NewDeck____, onSubmit, ERROR saving new DeckTitle, err:', err);
        // not sure where I should call `navigate` for the case of storage error
        this.props.navigation.navigate('Deck', { deck });
        return (err);
      });
  }

  render() {
              // TODO:
                  // /* ref={ref => this.textInputRef = ref} */   /*`this.textInputRef.focus()` must be called in cDM */
                  // onBlur={() => this.onBlur()}
                  // onSubmitEditing={() => this.onSubmit()}

                  // blurOnSubmit
                  // onSubmitEditing={({ nativeEvent }) => this.setState({ question: nativeEvent.question })} />

      return (
          <View style={styles.container}>

              <KeyboardAvoidingView {...keyboardAvoidingViewProps} style={{flex:6}}>
                <ScrollView styles={{flex: 4}}>
                  <View style={[styles.cardContainer, {flex: 1}]}
                    onLayout={this.getWidth}
                    >
                    <TextInput {...textInputProps} placeholder='Question'
                      style={styles.textInput}
                      width={this.state.textInputContainerWidth || 300}
                      value={this.state.question}
                      onChangeText={(question) =>
                      this.controlledTextInputQuestion(question)}
                      />

                    <TextInput {...textInputProps} placeholder='Answer'
                      style={styles.textInput}
                      width={this.state.textInputContainerWidth || 300}
                      value={this.state.answer}
                      onChangeText={(answer) => this.controlledTextInputAnswer(answer)}
                      />
                  </View>

                  <StyledButton
                    style={[styles.item, style={flex: 2}]}
                    onPress={() => this.onSubmit()}
                    disabled={!this.canSubmit()}
                    >
                    <Text>
                      Submit
                    </Text>
                  </StyledButton>
                </ScrollView>
              </KeyboardAvoidingView>
          </View>
      );
  }
}


// Options for `behavior` : enum('height', 'position', 'padding')
  // Note: Android and iOS both interact with this prop differently.
  // Android may behave better when given no behavior prop at all,
  // whereas iOS is the opposite.
const keyboardAvoidingViewProps = {
  behavior: 'padding',
};

// TODO: put keyboard up automatically if phone does Not have Physical keyboard
// TODO: put keyboard away onSubmit, so it's closed on the next screen

let textInputProps = {
  // autoFocus: true,     // strange behavior - don't uee
  maxLength: 50,
  //   // if multiline, "enter" key will "submit", instead of adding a newline
  multiline: true,        // TextInput's "submit" button triggers onSubmitEditing
  numlines: 3,            // :-( no effect really ) -- does *not* initialize text box to be 3 lines
  blurOnSubmit: true,     // so "return" does Not get captured by TextInput; triggers onSubmitEditing
  autoCapitalize: 'sentences',  //this is Not Working!
  autoCorrect: false,
  returnKeyType: 'send',  //'next',  //'done',
  placeholderTextColor: gray,
  selectionColor: primaryColorLight,
}
if (Platform.OS==='ios'){
  textInputProps = {
    ...textInputProps,
    // enablesReturnKeyAutomatically: true, // disables return key if no text
    keyboardAppearance: 'light',
    spellCheck: true,
    autoCorrect: false,  //ios only -- but it does Not seem to be working on ios
  }
}
if (Platform.OS==='android'){
  textInputProps = {
    ...textInputProps,
  }
}

//   // TODO: should I use onKeyPress instead of putting logic in onChange ??
//   /* onEndEditing={(title) => this.setState({title: title.trim()})} */
//   /* onBlur={(title) => this.setState({title: title.trim()})} */
//   /* clearButtonMode={"while-editing"} */
//   /* ref={ref => {this._emailInput = ref}} */
//   /* onSubmitEditing={this._submit} */ // invalid if {multi-line === true}




// TODO: DELETE UNUSED STYLES

let componentStyles = {
  // CONTAINER styles
  // wrapper: {
  //   // this was the previous container style
  //     flex: 1,
  //     backgroundColor: white,
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //   },
  container: {
    flex: 1,
    backgroundColor: white,
    alignItems: 'center',
    justifyContent: 'space-between',

    padding: 10,
    paddingTop: 30,
    paddingBottom: 5,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
    backgroundColor: '#fefefe',

    padding:     20,
    paddingTop:   0,
    marginLeft:  30,
    marginRight: 30,
    // marginTop:   10,
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
  buttonsContainer: {
    flex: 3,
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
  },
  buttonContainer: {
    justifyContent: 'center',
    margin: 10,
  },

  // TEXT Styles
  instructionsText: {
    flex: 1,
    // height: 50,
    fontSize: 20,
    color: gray,

    alignSelf: 'center',
    textAlign: 'center',
  },

  // INPUTTEXT styles
  textInput: {
    flex: 1,
    fontSize: 27,
    color: primaryColor,

    alignSelf: 'stretch',
    flexWrap:  'wrap',
    textAlign: 'center',
    marginTop: 10,
    paddingBottom: 10,
  },
};
// if (Platform.OS = 'android'){
//   componentStyles = {
//     ...componentStyles,
//     // underlineColorAndroid: primaryColorDark,
//   };
// }

// set to `false` for normal view, and production.
// set to `true`  to troubleshoot/test/visualize style layouts
//         Adds border outlines to styles to aid in UI layout design
//         Use only temporarily for editing styles/layout/UI-design.
const viewStyleLayout = false;
if (viewStyleLayout) {componentStyles = augmentStylesToVisualizeLayout(componentStyles);}

const styles = StyleSheet.create({
  ...componentStyles,
});


export default NewCard;

// TODO propTypes: deck
//                 (need deck.title for the id, and questions to prevent duplicates),
//                 navigation
//                 (in order to get the deck, which should be passed in from the prior component)
