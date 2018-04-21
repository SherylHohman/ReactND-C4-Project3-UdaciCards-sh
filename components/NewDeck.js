import React from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity,
         TextInput,
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
              <Text  style={[
                styles.infoText,
                styles.label,
                {flex: 1, textAlign: 'center'},
                ]}
                >
                Title for your New Quiz Deck
              </Text>

              <TextInput
                placeholder="Quiz Deck Title"
                maxLength={25}
                multiline={true}
                onChangeText={(title) => this.setState({ title })}
                value={this.state.title}
                onEndEditing={(title) => this.setState({title: title.trim()})}
                onSubmitEditing={() => this.onSubmit()}
                style={styles.textInput}
                >
              </TextInput>
            </View>

            <View style={[styles.buttonsContainer, styles.buttonContainer]}>
              <StyledButton
                style={[styles.item, style={flex: 2}]}
                onPress={() => this.onSubmit()}
                >
                <Text>
                  Submit
                </Text>
              </StyledButton>
            </View>
          </View>
      );

  }
}

// // TODO: adjust styles to resemble Quiz.
// //   use below to help with alignment.
// const testing = false;
// const borderWidth = testing ? 2 : 0;

//     //TEMP
//     borderColor: 'red'  (containers)
//     borderWidth,
//     borderColor: 'blue' (text)
//     borderWidth,

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
  titleText: {
    fontSize: 27,
    color: primaryColor,

    alignSelf: 'center',
    flexWrap:  'wrap',
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
  label: {
    marginBottom: 20,
  },

  // INPUTTEXT styles
  textInput: {
    fontSize: 27,
    color: primaryColor,

    alignSelf: 'stretch',
    flexWrap:  'wrap',
    textAlign: 'center',

  },
  textInputIos: {},
  textInputAndroid: {},
});
