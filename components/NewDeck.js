import React from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity,
         TextInput, KeyboardAvoidingView,
         StyleSheet, Platform ,
       } from 'react-native';
// Components
import NewCard from  '../components/NewCard';
import StyledButton from '../components/StyledButton';
// actionCreators, reducers, selectors, Api's
import { saveDeck } from '../store/decks/actionCreators';
import { getDeckList } from '../store/decks/selectors';
import { fetchDecks } from '../utils/api';
import { saveDeckTitle } from '../utils/api';
// Constants, Helpers
import { white, gray, primaryColor, primaryColorDark,
         isCorrectColor, isIncorrectColor,
       } from '../utils/colors';
import { titleCase, stripInvalidChars, makeStringUnique }
  from '../utils/helpers';
// dev
import { augmentStylesToVisualizeLayout } from '../utils/helpers';


class NewDeck extends React.Component {

  // TODO: static.. add TabNavigator Header (optional)

  state = {
    title: '',
    canSubmit: false,
  }

  controlledTextInput(title){
    title = titleCase(stripInvalidChars(title));
    const canSubmit = this.isValidInput(title);
    this.setState({ title, canSubmit });
    // return title;

  }
  isValidInput(text){
    return text.trim() !== '';
    // TODO: check for unique title, and require user to edit it
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
    saveDeckTitle(title)

      // TODO: update store
      // .then((id, title) => dispatch(receivedDecks(id, title)))
      // .catch(err => {
      //   // dispatch(receiveDecksFailure(err))
      // });

    // navigate
    this.props.navigation.navigate('Home');
  }

  render() {

      return (
          <View style={styles.container}>
            <View style={[styles.cardContainer, {flex: 1}]}>
              <Text  style={styles.instructionsText}
                >
                Title for your New Quiz Deck
              </Text>

              <KeyboardAvoidingView {...keyboardAvoidingViewProps}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Quiz Deck Title"
                  value={this.state.title}
                  onChangeText={(title) => this.controlledTextInput(title)}
                  onSubmitEditing={() => this.onSubmit()}
                  >
                </TextInput>
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

  // Props for <TextInput>
  const textInputProps = {
    /* onChange={(title) => this.setState({ title })} */  // similar to onChangeText
    maxLength: 25,
    multiline: true,
    autoFocus: true,     /* takes focus at componentDidMount, saves the user a click */
    autoCorrect: false,  //ios only -- but it does Not seem to be working on ios
    returnKeyType: "done",
    // TODO: pull keyboard up automatically if phone does Not have Physical keyboard
    // TODO: get height of soft Kyeboard
    //       - edit layout design to render in the area unoccupied by the
    //         keyboard (even when it is not showing),
    //         but allow it to take up more vertical space if needed,
    //         (but only while keyboard is *not* showing)
    //         also add scrollView just in case, so user can access hidden content.

    /* onEndEditing={(title) => this.setState({title: title.trim()})} */
    /* onBlur={(title) => this.setState({title: title.trim()})} */
    /* clearButtonMode={"while-editing"} */
    /* returnKeyType = {"next"} */
    /* returnKeyType = {"done"} */
    /* ref={ref => {this._emailInput = ref}} */
    /* placeholder="email@example.com" */
    /* autoCapitalize="none" */
    /* keyboardType="email-address" */
    /* returnKeyType="send" */
    /* onSubmitEditing={this._submit} */
  };

  // Options for `behavior` : enum('height', 'position', 'padding')
    // Note: Android and iOS both interact with this prop differently.
    // Android may behave better when given no behavior prop at all,
    // whereas iOS is the opposite.
  const keyboardAvoidingViewProps = {
    // keyboardVerticalOffset: Platform.OS === 'ios' ? 40 : 0,
    // behavior: Platform.OS === 'ios' ? 'padding' : '',
    // behavior: Platform.OS === 'ios' ? 'padding' : 'height',
    // behavior: Platform.OS === 'ios' ? 'padding' : 'position',
    behavior: 'padding',
  };
  // TODO: keyboardAvoidingView is still wonky on android.
  //   - tried many options, and wrapping various segments both individually,
  //     and in various group combinations.  This is the best so far.
  //     But.. on Nexus 6P emulator, with Android 23,
  //     it Partially covers the infoText/label "Title for your.."
  //     - it would be better to cover it *completely* (or not at all)
  //     The next best was to wrap *all* the elements in a single keyboardAvoidingBiew,
  //     .. but then the infoText/label "Title for your.." Never Shows At All
  //        on either platform, whether or not the keyboard is visible !
  //        also, both the input and submit button are at the top with tons of whitespace below.
  //     This whole keyboard thing seems quite finicky !!
  //   - keyboardVerticalOffset seemed to have *No* effect, no matter the number
  //   - despite the docs suggestions, only "padding" seemed to have any effect
  //       on Android
  //
  //   ..Ahh, it seems to be an issue with font size - with large font, the
  //     input font overlaps the text above.  With a small font, this does not
  //     happen.  So.. look into options regulating input box, padding/margin,
  //     in the TextInput documentation.  Not much else to do about *that* in
  //     keyboardAvoiding..
  //
  //   - Additionally, fudge around with all the styles a bit more.
  //     styles for this component ought to be simplified anyway.

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
  everythingExceptProgressBar: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: white,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
    // alignItems: 'stretch',
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
    // marginBottom: 20,
    // paddingBottom: 20,
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
