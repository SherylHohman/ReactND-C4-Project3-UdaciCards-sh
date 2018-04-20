import React from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Platform } from 'react-native';
// Components
import StyledButton from '../components/StyledButton';
// actionCreators, reducers, selectors
import { getDeckInfo } from '../store/decks/selectors';
import { white, gray, primaryColor, primaryColorDark } from '../utils/colors';

class Deck extends React.Component {
  render() {
    const { title, id, numCards } = this.props.deckInfo;
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.titleText}>Deck: {title}</Text>
          <Text style={styles.infoText}>{numCards} Questions</Text>
        </View>

        <StyledButton
          customColor={primaryColor}
          onPress={() => this.props.navigation.navigate(
            'Quiz',
            /* below passes in as: this.props.navigation.state.params.id*/
            { id }
          )}
        >
        Take Quiz !
        </StyledButton>

        <StyledButton
          customColor={primaryColor}
          onPress={() => this.props.navigation.navigate(
            'NewCard',
            /* below passes in as: this.props.navigation.state.params.id*/
            { id }
          )}
        >
        Add a New Question
        </StyledButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  titleText: {
    fontSize: 27,
    color: primaryColor,
    alignSelf: 'center',
  },
  infoText: {
    fontSize: 20,
    color: gray,
    alignSelf: 'center',
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: white,
    padding:     20,
    marginLeft:  10,
    marginRight: 10,
    marginTop:   10,
    borderRadius: Platform.OS === 'ios' ? 20 : 10,

    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0, 0, 0, 0.24)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
});

function mapStoreToProps(store, ownProps){
  console.log(ownProps);
  const deckInfo  = getDeckInfo(store, ownProps.navigation.state.params.id) || null;

  return {
    deckInfo,
  }
}

export default connect(mapStoreToProps)(Deck);
