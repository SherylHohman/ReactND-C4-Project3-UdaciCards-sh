import React from 'react';
import { View, Text, TouchableOpacity,
         TextInput, KeyboardAvoidingView, ScrollView,
         Keyboard,
         StyleSheet, Platform,
       } from 'react-native';
import PropTypes from 'prop-types';
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

// dev  TODO: only enable this import and its usage while in dev
import { augmentStylesToVisualizeLayout } from '../utils/helpers';


class NewCard extends React.Component {

  constructor(props) {
    super(props);

  // for automatically "tabbing" through fields, and opening keyboard at cDM
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }

  // for automatically "tabbing" through fields
  focusNextField(id) {
    this.inputs[id].focus();
  }

  static navigationOptions = ({ navigation }) => {
    const { deck } = navigation.state.params;
    return { title: `${deck.title}: (add Q/A card)`}
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

  //  opens keyboard automatically !! (in conjunction with:
  //  ref definitions, focusNextField, and constructor code)
    this.focusNextField('question');
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

    // TODO: tabs, newlines, are not being removed
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

  // onBlur(field){
    //  // ERROR: infinite recurse !!
    // let text = this.state[field]
    // if (text !== text.trim()) {
    //   this.setState(prevState => {
    //     return {
    //       [field]: text,
    //     }
    //   });
    // }
  // }

  canSubmit(){
    return Object.values(this.state.errorMssg)  .every(value => value === '') &&
           Object.values(this.state.beenTouched).every(value => value === true) &&
           // disallow re-submitting if user clicks back button after already submitted
           (this.state.existingQuestions.indexOf(this.state.question) === -1);
  }

  onSubmit(){
    if (!this.canSubmit()) {return;}

    // Force Close the keyboard !!
    // In DeckList, it closes automatically. Dunno why it was NOT closing here..
    Keyboard.dismiss();

    const { deck } = this.state;
    let   question = this.state.question.trim();
    const answer   = this.state.answer.trim();

    // send to "DB"
    saveCard(deck, { question, answer })
      .then((deck)=>{

        // add new title to existing titles, so cannot be-resubmitted
        //  WHY: if user clicks "back" button and the "submit title" screen
        //  appears with the same info that had just submitted, allowing it to
        //  be submitted again, duplicating the card.
        //  This ensures a re-submit would be invalid, as the Q is known to already exist.
        this.setState(prevState => {
          return {
            existingQuestions: prevState.existingQuestions.concat([this.state.question]),
          }
        });

        // if was using redux, could navigate without waiting on a `then`..
        //  since I'm not, must wait for AsyncStorage to update value for deck
        this.props.navigation.navigate('Deck', { deck });
      })

      .catch((err) => {
        console.log('____NewDeck____, onSubmit, ERROR saving new DeckTitle, err:', err);
        this.props.navigation.navigate('Deck', { deck });
        return (err);
      });
  }

  render() {

      return (
          <View style={styles.container}>

              <KeyboardAvoidingView {...keyboardAvoidingViewProps} style={{flex:6}}>
                <ScrollView styles={{flex: 4}}
                  keyboardShouldPersistTaps='handled'
                >
                  <View style={[styles.cardContainer, {flex: 1}]}
                    onLayout={this.getWidth}
                    >
                    <TextInput {...textInputProps} placeholder='Question'
                      style={styles.textInput}
                      width={this.state.textInputContainerWidth || 300}
                      value={this.state.question}
                      onChangeText={(question) =>
                        this.controlledTextInputQuestion(question)}
                      // TODO:
                      //   onEndEditing={(question) => this.setState({question: question.trim()})}
                      //   onBlur={(question) => this.setState({question: question.trim()})}

                      /* tab between inputs keeping keyboard up,
                         submits on the last input field, and puts keyboard away
                      */
                      ref={(input) => {this.inputs['question'] = input}}
                      returnKeyType={ "next" }
                      blurOnSubmit={false}
                      onSubmitEditing={() => {
                        // specify the key of the ref, as done in the previous section.
                        this.focusNextField('answer');
                        }}
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
                      // TODO:
                      //   onEndEditing={(question) => this.setState({question: question.trim()})}
                      //   onBlur={(question) => this.setState({question: question.trim()})}

                      /* tab between inputs keeping keyboard up,
                         submits on the last input field, and puts keyboard away
                      */
                      ref={(input) => {this.inputs['answer'] = input;}}
                      returnKeyType={ "done" }
                      blurOnSubmit={true}
                      onSubmitEditing={() => {
                        // No more refs - so submit!
                        this.onSubmit();
                        }}
                      />
                      <Text style={{color:'red', textAlign:'center', margin:5}}>
                        {/* space prevents input box from jumping when error message appears/disappears */}
                        {' ' + this.state.errorMssg.answer}
                      </Text>
                  </View>

                  <StyledButton
                    style={[styles.buttonsContainer, styles.buttonContainer]}
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

let textInputProps = {
  // autoFocus: true,     // strange behavior - don't use
  maxLength: 70,          // max number of characters allowed
  numlines:   3,          // :-( no effect really ) -- does *not* initialize text box to be 3 lines

  // if multiline, "enter" key, aka TextInput's "submit" triggers onSubmitEditing,
  // instead of adding a newline
  multiline: true,

  // if blurOnSubmit, "return" does Not get captured by TextInput;
  //   triggers onSubmitEditing.
  //   - onSubmitEditing
  //    Callback that is called when the text input's submit button is pressed.
  //    Invalid if multiline={true} is specified.
  //    (docs seem to have a contradiction! )
  // If blurOnSubmit === true, the text field will blur when submitted.
  //   The default value is true for single-line fields and false for multiline fields.
  //   Note that for multiline fields, setting blurOnSubmit to true means that
  //   pressing return will blur the field and trigger the onSubmitEditing event
  //   instead of inserting a newline into the field.
  blurOnSubmit: true,

  // TODO: might need to write an onKeyPress function to handle
  //  removal of "tab" and "newline" keystrokes/characters

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
    underlineColorAndroid: primaryColorLight,
  }
}
// TODO:
   /* onEndEditing={(title) => this.setState({title: title.trim()})} */
   /* onBlur={(title) => this.setState({title: title.trim()})} */
   /* clearButtonMode={"while-editing"} */


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
    flex: 2,
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
    borderColor: Platform.OS === 'ios' ? primaryColorDark : 'transparent',
  },
};


const viewStyleLayout = false;
  // set to `false` for normal view, and production.
  // set to `true`  to troubleshoot/test/visualize style layouts
  //         Adds border outlines to styles to aid in UI layout design
  //         Use only temporarily for editing styles/layout/UI-design.
  if (viewStyleLayout) {componentStyles = augmentStylesToVisualizeLayout(componentStyles);}


const styles = StyleSheet.create({
  ...componentStyles,
});


NewCard.propTypes = {
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
              question:    PropTypes.string.isRequired,
              answer:      PropTypes.string,  // not required
            }).isRequired).isRequired
          }).isRequired
        }).isRequired,
      }).isRequired,
  }).isRequired,
}

export default NewCard;
