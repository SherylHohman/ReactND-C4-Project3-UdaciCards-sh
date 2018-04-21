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
import { fetchDecks } from '../utils/api';
// Constants, Helpers, Api's
import { white, gray, primaryColor, primaryColorDark,
         isCorrectColor, isIncorrectColor,
       } from '../utils/colors';


export default class NewDeck extends React.Component {

  state = {
    title: '',
  }

  isValidInput(title){
    // rem setState is asynch, so passed in the would-be value of state.title
    this.setState({title});
    return title !== '';
    // TODO: invalid if stripped text is an EmptyString
    // TODO: if inValid, disable Submit Button
    // TODO: if valid, enable the Submit Button
    // no need to highlight fields, as there is only 1, and an empty field is obviously wrong
  }
  onSubmit(){
    const title = this.state.title.trim();
    this.setState({ title });
    console.log('User sent:', this.state.title);
    // rem setState is Asynch, so cannot rely on using the updated value immediately
    // for computations
    // (it is fine to use immediately for UI because it can always re-render when the value *actually* changes)
    console.log(this.isValidInput(title));
    console.log('Submitting:', title);
    // TODO: trim() input string
    // TODO: validate input
    // TODO: send to "DB"
    // TODO: update store
    // TODO: navigate

    // this.setState({title: ''});
  }

  render() {
    // return (
    // TODO:
    //   <View style={styles.container}>
    //     <Text>
    //       - New Deck Page // can add TabNavigator Heador (optional item)
    //       - Add a New Quiz Deck Title
    //       - Input Box
    //       - Submit Button
    //     </Text>
    //   </View>
    // );
            // <View style={[styles.cardContainer, {flex: 1}]}>
      return (
          <View style={styles.container}>
            <View style={[styles.cardContainer, {flex: 1}]}>
              <Text  style={styles.instructionsText}
                >
                Title for your New Quiz Deck
              </Text>

              <KeyboardAvoidingView {...keyboardAvoidingView}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Quiz Deck Title"
                  onChangeText={(title) => this.setState({ title })}
                  value={this.state.title}
                  onSubmitEditing={() => this.onSubmit()}
                  >
                </TextInput>
              </KeyboardAvoidingView>
            </View>

            <KeyboardAvoidingView
              /* behavior={Platform.OS === 'ios' ? 'padding' : ''} */
              {...keyboardAvoidingView}
              style={[styles.buttonsContainer, styles.buttonContainer]}
              >
              <StyledButton
                style={[styles.item, style={flex: 2}]}
                onPress={() => this.onSubmit()}
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

  // Paramaters for <TextInput>
  const textInput = {
    /* onChange={(title) => this.setState({ title })} */  // similar to onChangeText
    maxLength: 25,
    multiline: true,
    autoFocus: true,     /* takes focus at componentDidMount, saves the user a click */
    autoCorrect: false,  //ios only -- but it does Not seem to be working on ios
    returnKeyType: "done",
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
  const keyboardAvoidingView = {
    // keyboardVerticalOffset: Platform.OS === 'ios' ? 40 : 0,
    // behavior: Platform.OS === 'ios' ? 'padding' : '',
    // behavior: Platform.OS === 'ios' ? 'padding' : 'height',
    // behavior: Platform.OS === 'ios' ? 'padding' : 'position',
    behavior: 'padding',
  };
  // TODO: This is still wonky on android.
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

const styles = StyleSheet.create({
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
});
