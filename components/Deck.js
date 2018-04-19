import React from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
// actionCreators, reducers, selectors
import { getDeckInfo } from '../store/decks/selectors';
import { white, primaryColor, primaryColorDark } from '../utils/colors';

class Deck extends React.Component {
  render() {
    const { title, id, numCards } = this.props.deckInfo;
    return (
      <View style={styles.container}>
        <Text>Deck: {title}</Text>
        <Text>{numCards} Questions</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    alignItems: 'center',
    justifyContent: 'center',
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
