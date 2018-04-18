import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { white, primaryColor, primaryColorDark } from '../utils/colors';

export default class Deck extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Deck: {"<TBA>"}</Text>
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
