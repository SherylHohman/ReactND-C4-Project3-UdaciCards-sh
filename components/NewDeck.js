import React from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity,
         TextInput, KeyboardAvoidingView,
         StyleSheet, Platform,
       } from 'react-native';
// Components
import StyledButton from '../components/StyledButton';
// actionCreators, reducers, selectors, Api's
import { saveDeck }      from '../store/decks/actionCreators';
import { getDeckList }   from '../store/decks/selectors';
import { fetchDecks }    from '../utils/api';
import { saveDeckTitle } from '../utils/api';
// Constants, Helpers
import { white, gray, primaryColor, primaryColorDark, primaryColorLight,
       } from '../utils/colors';
import { titleCase, stripInvalidChars, makeStringUnique }
  from '../utils/helpers';

// dev  TODO: enly enable this import and its usage while in dev
import { augmentStylesToVisualizeLayout } from '../utils/helpers';


class NewDeck extends React.Component {

  // TODO: static.. add TabNavigator Header (optional)

  state = {
    title: '',
    canSubmit: false,
  }

// componentDidMount () {
//     // this.textInputRef.focus()
// }

  controlledTextInput(title){
    title = titleCase(stripInvalidChars(title));
    // const canSubmit = this.isValidInput(title);
    this.setState({ title, canSubmit: this.isValidInput(title) });
    // return title;
  }

  isValidInput(text){
    return text.trim() !== '';
    // TODO: check for unique title, and require user to edit it
  }

  onBlur(){
    // title = this.state.title.trim();
    // const unique = makeStringUnique(title, this.props.existingTitles);
    // // TODO: if unique !== title, highlight this to the user, so they can edit
    // //       if they don't like the revised title
    // this.setState({ title: unique });
  }

  onSubmit(){
    let title = this.state.title.trim();

    // send to "DB"
    // TODO: show "invalid title" message to user instead, and disable sSubmit btn,
    //       so they control how to make the title unigue, instead of
    //       me silently appending a number to the title
    // Use title as id, instead of sligifying  the title
    //       since I'm disallowing special chars,
    //       ane ensuring uniqueness, I can use the title string - spaces and all.

    // create id
    title = makeStringUnique(title, this.props.existingTitles)
    console.log('in NewDeck, onSubmit, before saveDeckTitle');
    // update DB
    saveDeckTitle(title)
      // update store
      .then((mergedItem={}) => {
        console.log('in NewDeck, onSubmit, after  AsyncStorage merge');
        this.props.dispatch(addDeck(mergedItem));
      })
      .catch((err) => {
        console.log('NewDeck, onSubmit, error saving new DeckTitle, err:', err);
        // return (err);
      });
    // navigate
    this.props.navigation.navigate('Home');
  }

  render() {

                  // /* ref={ref => this.textInputRef = ref} */   /*`this.textInputRef.focus()` must be called in cDM */
                  // onBlur={() => this.onBlur()}
                  // onSubmitEditing={() => this.onSubmit()}

                  // blurOnSubmit
                  // onSubmitEditing={({ nativeEvent }) => this.setState({ title: nativeEvent.title })} />
      return (
          <View style={styles.container}>
            <View style={[styles.cardContainer, {flex: 1}]}>
              <Text  style={styles.instructionsText}
                >
                Title for your New Quiz Deck
              </Text>

              <KeyboardAvoidingView {...keyboardAvoidingViewProps}>
                <TextInput {...textInputProps}
                  style={styles.textInput}
                  value={this.state.title}
                  onChangeText={(title) => this.controlledTextInput(title)}
                  />
              </KeyboardAvoidingView>
            </View>

            <KeyboardAvoidingView
              {...keyboardAvoidingViewProps}
              style={[styles.buttonsContainer, styles.buttonContainer]}
              >
              <StyledButton
                style={[styles.item, style={flex: 2}]}
                onPress={() => this.onSubmit()}
                disabled={!this.state.canSubmit}
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

  // // Props for <TextInput>
  // multiline: false,
  // autoFocus: true,     takes focus at componentDidMount, saves the user a click
let textInputProps = {
  placeholder: 'Quiz Deck Title',
  autoFocus: true,
  maxLength: 25,
  autoCapitalize: 'words',
  autoCorrect: false,
  returnKeyType: 'send',
  placeholderTextColor: gray,
  selectionColor: primaryColorLight,
}
// if (Platform.OS==='ios'){
//   textInputProps = {
//     ...textInputProps,
//     enablesReturnKeyAutomatically: true, // disables return key if no text
//     keyboardAppearance: 'light',
//     spellCheck: true,
//   }
// }
// if (Platform.OS==='android'){
//   textInputProps = {
//     ...textInputProps,
//   }
// }

  // // Props for <TextInput>
  // let textInputProps = {
  //   // if multiline, "enter" key will "submit", instead of adding a newline
  //   blurOnSubmit=true,

  //   // TODO: pull keyboard up automatically if phone does Not have Physical keyboard
  //   // TODO: get height of soft Kyeboard
  //   //       - edit layout design to render in the area unoccupied by the
  //   //         keyboard (even when it is not showing),
  //   //         but allow it to take up more vertical space if needed,
  //   //         (but only while keyboard is *not* showing)
  //   //         also add scrollView just in case, so user can access hidden content.

  //   // TODO: open softKeyboard, if device does not have physical keyboard
  //   //       onFocus={}

  //   // TODO: should I use onKeyPress instead of putting logic in onChange ??
  //   /* onEndEditing={(title) => this.setState({title: title.trim()})} */
  //   /* onBlur={(title) => this.setState({title: title.trim()})} */
  //   /* clearButtonMode={"while-editing"} */
  //   /* ref={ref => {this._emailInput = ref}} */
  //   /* onSubmitEditing={this._submit} */ // invalid if {multi-line === true}
  // };
  // // if (Platform.OS==='ios'){
  // //   textInputProps = {
  // //     ...textInputProps,
  // //     enablesReturnKeyAutomatically: true, // disables return key if no text
  // //     keyboardAppearance: 'light',
  // //     spellCheck: true,
  // //   }
  // // }
  // // if (Platform.OS==='android'){
  // //   textInputProps = {
  // //     ...textInputProps,
  // //   }
  // // }

// Options for `behavior` : enum('height', 'position', 'padding')
  // Note: Android and iOS both interact with this prop differently.
  // Android may behave better when given no behavior prop at all,
  // whereas iOS is the opposite.
const keyboardAvoidingViewProps = {
  behavior: 'padding',
};
// TODO: DELETE UNUSED STYLES

let componentStyles = {
  // CONTAINER styles
  wrapper: {
    // this was the previous container style
      flex: 1,
      backgroundColor: white,
      alignItems: 'center',
      justifyContent: 'center',
    },
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
    fontSize: 20,
    color: gray,

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
    marginTop: 10,
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

function mapStoreToProps(store){
  const decks  = getDeckList(store) || null;
  // ensure titles are unique (better UX than if just make id unique)
  const existingTitles = decks && decks.map(deck => {
    return deck.title
  }) || [];
  return {
    existingTitles,
  }
}
export default connect(mapStoreToProps)(NewDeck);
