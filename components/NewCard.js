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
import { titleCase, collapseSpaces }
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

    errorMssg: {
      question: '',
      answer:   '',
    },
    beenTouched: {
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

    // TODO: tabs are not being removed
    text = collapseSpaces(text);

    const isInvalidErrorMessage = this.isInvalidErrorMessage(text);
    const isUniqueErrorMessage  = this.isUniqueErrorMessage(text);

    this.setState((prevState) => {
      return {
        ...prevState,
        question: text,
        errorMssg: {
          ...prevState.errorMssg,
          question: isInvalidErrorMessage + isUniqueErrorMessage,
        },
      }
    });

    if (!this.state.beenTouched.question){
      this.setState(prevState => {
        return {
          beenTouched: {
            ...prevState.beenTouched,
            question: true,
          }
        }
      });
    }
  }

  controlledTextInputAnswer(text){
    // no need to strip characters, as it is never used as an object/DB "key"
    text = collapseSpaces(text);

    const isInvalidErrorMessage = this.isInvalidErrorMessage(text);
    this.setState((prevState) => {
      return {
        answer: text,
        errorMssg: {
          ...prevState.errorMssg,
          answer: isInvalidErrorMessage,
        },
      }
    });

    if (!this.state.beenTouched.answer){
      this.setState(prevState => {
        return {
          beenTouched: {
            ...prevState.beenTouched,
            answer: true,
          }
        }
      });
    }
  }

  isInvalidErrorMessage(text){
    return (collapseSpaces(text).trim() === '')
            ? 'Cannot be an empty string.  '
            : ''
  }
  isUniqueErrorMessage(question){
    return (this.state.existingQuestions.indexOf(question) !== -1)
            ? errorMssg = 'This question already exists.  '
            : '';
  }

  onBlur(field){
    //  // ERROR: infinite recurse !!
    // let text = this.state[field]
    // if (text !== text.trim()) {
    //   this.setState(prevState => {
    //     return {
    //       [field]: text,
    //     }
    //   });
    // }
  }

  canSubmit(){
    return Object.values(this.state.errorMssg)  .every(value => value === '') &&
           Object.values(this.state.beenTouched).every(value => value === true);
  }

  onSubmit(){
    if (!this.canSubmit()) {return;}

    const { deck } = this.state;
    let   question = this.state.question.trim();
    const answer   = this.state.answer.trim();

    // send to "DB"
    saveCard(deck, { question, answer })
      .then((deck)=>{

        // if was using redux, could navigate without waiting on a `then`..
        //  since I'm not,  must get updated value for deck from AsyncStorage
        this.props.navigation.navigate('Deck', { deck });
      })

      .catch((err) => {
        console.log('____NewDeck____, onSubmit, ERROR saving new DeckTitle, err:', err);
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

      // console.log('__NewCard__, render, this.state: ', this.state);
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
                      // onEndEditing={(question) => this.setState({question: question.trim()})}
                      // onBlur={(question) => this.setState({question: question.trim()})}
                      />
                      <Text style={{color:'red', textAlign:'center', margin:5}}>
                      {/* space prevents input box from jumping when error message appears/disappears */}
                        {' ' + this.state.errorMssg.question}
                      </Text>

                    <TextInput {...textInputProps} placeholder='Answer'
                      style={styles.textInput}
                      width={this.state.textInputContainerWidth || 300}
                      value={this.state.answer}
                      onChangeText={(answer) =>
                        this.controlledTextInputAnswer(answer)}
                      // onBlur={this.onBlur('answer')}
                      />
                      <Text style={{color:'red', textAlign:'center', margin:5}}>
                        {/* space prevents input box from jumping when error message appears/disappears */}
                        {' ' + this.state.errorMssg.answer}
                      </Text>
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
const keyboardAvoidingViewProps = {
  behavior: 'padding',
};

// TODO: put keyboard away onSubmit, so it's closed on the next screen
//       BUT NOT when press "enter/return" from TextInput field

let textInputProps = {
  // autoFocus: true,     // strange behavior - don't use
  maxLength: 70,          // max number of characters allowed
  numlines:   3,          // :-( no effect really ) -- does *not* initialize text box to be 3 lines
  // if multiline, "enter" key, aka TextInput's "submit" triggers onSubmitEditing,
  // instead of adding a newline

  multiline: true,
  // if blurOnSubmit, "return" does Not get captured by TextInput; triggers onSubmitEditing.
  // If true, the text field will blur when submitted.
  //   The default value is true for single-line fields and false for multiline fields.
  //   Note that for multiline fields, setting blurOnSubmit to true means that
  //   pressing return will blur the field and trigger the onSubmitEditing event
  //   instead of inserting a newline into the field.

  // onSubmitEditing
  //  Callback that is called when the text input's submit button is pressed.
  //  Invalid if multiline={true} is specified.
  //  (docs seem to have a contradiction! )

  blurOnSubmit: true,
  // onsubmitEditing puts keyboard away :-) ??
  // TODO: can I put keyboard away if SubmitButton, but not if on text field ?
  returnKeyType: 'send',  //'next', //'done', //TODO: next does Not work as Expected -- why?

  // TODO: might need to write an onKeyPress function to handle
  //  tabbing, submitting, and putting keyboard away

  autoCapitalize: 'sentences',  //this is Not Working on Android!
  placeholderTextColor: gray,
  selectionColor: primaryColorLight,
}
if (Platform.OS==='ios'){
  textInputProps = {
    ...textInputProps,
    enablesReturnKeyAutomatically: true, // disables return key if no text
    keyboardAppearance: 'light',
    autoCorrect: false,  //ios only -- but it does Not seem to be working on ios
    spellCheck: true,    //ios only -- but it does Not seem to be working on ios
  }
}
if (Platform.OS==='android'){
  textInputProps = {
    ...textInputProps,
    underlineColorAndroid: primaryColorDark,
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

    borderWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: Platform.OS === 'ios' ? gray : 'transparent',
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

// TODO propTypes: deck
//                 (need deck.title for the id, and questions to prevent duplicates),
//                 navigation
//                 (in order to get the deck, which should be passed in from the prior component)

export default NewCard;
