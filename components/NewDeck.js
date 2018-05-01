import React from 'react';
import { View, Text, TouchableOpacity,
         TextInput, KeyboardAvoidingView,
         StyleSheet, Platform,
       } from 'react-native';
import PropTypes from 'prop-types';
// Components
import StyledButton from '../components/StyledButton';
// Constants, Helpers, Api's
import { retrieveDecks }    from '../utils/api';
import { saveDeckTitle } from '../utils/api';
// Constants, Helpers
import { titleCase, stripInvalidChars, collapseSpaces }
  from '../utils/helpers';
import { white, gray, primaryColor, primaryColorDark, primaryColorLight,
       } from '../utils/colors';

// dev  TODO: only enable this import (and its invocation) while in dev
import { augmentStylesToVisualizeLayout } from '../utils/helpers';


class NewDeck extends React.Component {

  constructor(props) {
    super(props);

  // for automatically "tabbing" through fields
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }

  // TODO: static.. add TabNavigator Header (optional)

  state = {
    title: '',
    beenTouched: false,
    errorMessage: '',

    // not expected to change after component mounts, until it has been saved to "DB"
    // (if using redux, these would be props instead, and set by selectors in mSTP)
    existingTitles: [],
  }

  componentDidMount () {
    //TODO: fetchDecks in App.js instead, and pass decks in to via TabNavigator
    //      (to both tabs: NewDeck -and- DeckList)

    //  opens keyboard automatically !! (in conjunction with:
    //  ref definition(in TextInput), focusNextField, and constructor code)
    // TODO: why does this *Not* bring keyboard up ?? It *does* in NewCard.. !!??
    this.focusNextField('titleField');


    // if decks is passed in (ie link from DeckList, where decks is known to be an EMPTY array)
    let decksArray = (this.props.navigation &&
                 this.props.navigation.state.params &&
                 this.props.navigation.state.params.decks) || undefined;
    if (decksArray) {
        const titles = decksArray.map( deck => title );
        this.setState({ existingTitles: titles });
        return;
    }
    else {
    // deck not passed in (ie got here by clicking on tab, not via internal nav, or from a link)
      console.log('NewDeck.cDM decks not passed in,so fetching" them..', this.props);
      retrieveDecks()
        .then((decksObj) => {
          // not expected to change during life of this component
          const existingTitles = decksObj && Object.keys(decksObj) || [];
          this.setState({ existingTitles });
        });
    }

    // SHOULD Open keyboard automatically !! (in conjunction with:
    //    ref definition(in TextInput), focusNextField, and constructor code)
    // TODO: why does this *Not* bring keyboard up ?? It *does* in NewCard.. !!??
    this.focusNextField('titleField');
}

  // for automatically "tabbing" through fields, and setting focus fiels at cDM
  focusNextField(id) {
    this.inputs[id].focus();
  }

  controlledTextInput(prevTitle){
    // used as a "DB"/storage key, so stripping characters
    const title = titleCase(stripInvalidChars(prevTitle));

    const isEmptyStringErrorMessage = this.isEmptyStringErrorMessage(title);
    const isUniqueErrorMessage = this.isUniqueErrorMessage(title);
    const errorMessage = isEmptyStringErrorMessage + isUniqueErrorMessage;

    this.setState({
      title,
      errorMessage,
      beenTouched: true,
    });
  }

  isEmptyStringErrorMessage(text){
    return (collapseSpaces(text).trim() === '')
            ? 'Cannot be an empty string.  '
            : ''
  }
  isUniqueErrorMessage(title){
    return (this.state.existingTitles.indexOf(title) !== -1)
            ? 'This title already exists.  '
            : ''
  }

  // onBlur(){
  //   // title = this.state.title.trim();
  //   // const unique = makeStringUnique(title, this.props.existingTitles);
  //   // // TODO: if unique !== title, highlight this to the user, so they can edit
  //   // //       if they don't like the revised title
  //   // this.setState({ title: unique });
  // }

  canSubmit(){
    return (!this.state.errorMessage && this.state.beenTouched) &&
           // disallow re-submitting if user clicks back button after already submitted
           (this.state.existingTitles.indexOf(this.state.title) === -1);
;
  }

  onSubmit(){
    if (!this.canSubmit()) { return; }

    const { existingTitles } = this.state;
    let title = this.state.title.trim();

    // send to "DB"
    saveDeckTitle(title)
      .then(()=>{
        // add new title to existing titles, so cannot be-resubmitted if
        //  user clicks "back" button and the "submit title" screen appears
        //  with the same info that had just submitted.
        this.setState(prevState => {
          return {
            existingTitles: prevState.existingTitles.concat([this.state.title]),
          }
        });

        // if was using redux, could navigate without waiting on a `then`..
        //   because, whenever the redux store updated, "Home" would re-render.
        //  since I'm not, must make sure AsyncStorage has updated before
        //   navigate to the next page - b/c it only fetches/updates titles at cDM
        this.props.navigation.navigate('Home');
        return;
      })

      .catch((err) => {
        console.log('____NewDeck____, onSubmit, error saving new DeckTitle, err:', err);
        // not sure IF I should call `navigate` for the case of storage error
        this.props.navigation.navigate('Home');
        return (err);
      });

    console.log('..exiting NewDeck onSubmit (but the async saveDeckTitle is probably still running)');
  }

  render() {

      return (
          <View style={styles.container}>
            <View style={[{flex: 1}]}>
              <Text  style={styles.instructionsText}
                >
                Title for your New Quiz Deck
              </Text>

              <KeyboardAvoidingView {...keyboardAvoidingViewProps}>
                <TextInput {...textInputProps}
                  style={styles.textInput}
                  value={this.state.title}
                  onChangeText={(title) => this.controlledTextInput(title)}

                  /* (so can tab between input fields, while keeping keyboard up),
                     submits on "enter", since it is the last input field,
                     puts keyboard away
                  */
                  ref={(input) => {this.inputs['titleField'] = input}}
                  returnKeyType={ "done" }
                  blurOnSubmit={true}    // No more refs to tab thru, so true
                  onSubmitEditing={() => {
                    // No more refs/TextInputs to tab thru, - so submit!
                    this.onSubmit();
                  }}
                  />

                <Text style={{color:'red', textAlign:'center', margin:5}}>
                  {/* space prevents input box from jumping when error message appears/disappears */}
                  {' ' + this.state.errorMessage}
                </Text>

              </KeyboardAvoidingView>
            </View>

            <KeyboardAvoidingView
              {...keyboardAvoidingViewProps}
              style={[styles.buttonsContainer]}
              >
              <StyledButton
                style={[styles.buttonContainer, style={flex: 2}]}
                onPress={ () => this.onSubmit()}
                disabled={!this.canSubmit()}
                >
                <Text>
                  Submit
                </Text>
              </StyledButton>
            </KeyboardAvoidingView>
          </View>
      );

  }
}

let textInputProps = {
  placeholder: 'Quiz Deck Title',
  // autoFocus: true,

  maxLength: 25,
  returnKeyType: 'send',

  // if blurOnSubmit, "return" does Not get captured by TextInput;
  //   instead, it triggers onSubmitEditing.
  //   If blurOnSubmit===true, the text field will blur when submitted.
  //     The default value is true for single-line fields and false for multiline fields.
  //     Note that for multiline fields, setting blurOnSubmit to true means that
  //     pressing return will blur the field and trigger the onSubmitEditing event
  //     instead of inserting a newline into the field.
  //   When setup for tabbing through test fields, blurOnSubmit s/b :
  //     true for "last" field,
  //     false for all others
  //   onSubmitEditing
  //    Callback that is called when the text input's submit button is pressed.
  //    Invalid if multiline={true} is specified.
  //    (docs seem to have a contradiction! )

  // blurOnSubmit: false,

  //   // if multiline, "enter" key will "submit", instead of adding a newline
  //   blurOnSubmit=true,

  autoCapitalize: 'words',
  placeholderTextColor: gray,
  selectionColor: primaryColorLight,
}
if (Platform.OS==='ios'){
  textInputProps = {
    ...textInputProps,
    enablesReturnKeyAutomatically: true, // disables return key if no text
    keyboardAppearance: 'light',
    autoCorrect: false,  //ios only -- but it does Not seem to be working
    spellCheck: true,    //ios only -- but it does Not seem to be working
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


const keyboardAvoidingViewProps = {
  // Options for `behavior` : enum('height', 'position', 'padding')
  behavior: 'padding',
};
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
  buttonsContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  // TEXT Styles
  instructionsText: {
    flex: 1,
    fontSize: 20,
    color: primaryColorDark,

    alignSelf: 'center',
    textAlign: 'center',
  },

  // INPUTTEXT styles
  textInput: {
    fontSize: 27,
    color: primaryColor,

    alignSelf: 'stretch',
    flexWrap:  'wrap',
    textAlign: 'center',

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


NewDeck.propTypes = {
  // - props.navigation.navigate
  // - props.navigation.state.params.decks = [
  //   decks NOT required - will "fetch" if not passed in.
  //      { deck.title,
  //        deck.questions
  //      }]
    navigation: PropTypes.shape({
      navigate:   PropTypes.func.isRequired,
      state:      PropTypes.shape({
        params:     PropTypes.shape({
          decks:       PropTypes.arrayOf(PropTypes.shape({
            title:      PropTypes.string.isRequired,
            questions:   PropTypes.array.isRequired,
          }),
        )}),
      }),
  }).isRequired,
}

export default NewDeck;
