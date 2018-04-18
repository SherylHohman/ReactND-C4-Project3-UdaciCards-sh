import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { white, primaryColor, primaryColorDark } from '../utils/colors';

export default class Quiz extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Quiz for deck: {"<TBA>"}</Text>
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
