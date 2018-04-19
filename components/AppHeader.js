import React from 'react';
import { StyleSheet, Text, View , TouchableOpacity} from 'react-native';
import { Platform } from 'react-native';
// Constants, Helpers, Api's
import { white, gray, primaryColor, primaryColorLight } from '../utils/colors';

const AppHeader = ({ children }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>
          Welcome to UdaciCards !!
        </Text>
        <Text style={styles.subTitleText}>
          by Sheryl Hohman
        </Text>
        <Text style={styles.headingText}>
          {children}
        </Text>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: primaryColorLight,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: 10,
  },
  // Text does not inherit styles (such as color), except from Text parent
  titleText: {
    fontSize: 30,
    color: white,
  },
  subTitleText: {
    fontSize: 15,
    color: white,
  },
  headingText: {
    fontSize: 25,
    color: white,
    paddingTop: 20,
    marginBottom: 10,
  },
});

export default AppHeader

