import React from 'react';
import { StyleSheet, Text, View , TouchableOpacity} from 'react-native';
import { Platform } from 'react-native';
// Constants, Helpers, Api's
import { white, gray, primaryColor, primaryColorLight, primaryColorDark } from '../utils/colors';

const AppHeader = ({ children }) => {
    return (
      <View style={[styles.container, Platform.OS==='ios' ? styles.iosHeaderShadow:'']}>
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

const backgroundColor = Platform.OS==='ios' ? '#fff' : primaryColorLight;
const textColor       = Platform.OS==='ios' ? primaryColor  : white;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: 10,
    borderRadius: Platform.OS === 'ios' ? 10 : 4,
  },
  iosHeaderShadow: {
    shadowRadius: 2,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0, 0, 0, 0.24)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  // Text does not inherit styles (such as color), except from Text parent
  titleText: {
    fontSize: 30,
    color: textColor,
  },
  subTitleText: {
    fontSize: 15,
    color: textColor,
  },
  headingText: {
    fontSize: 25,
    color: Platform.OS==='ios' ? primaryColorLight  : textColor,
    paddingTop: 20,
    marginBottom: 10,
  },
});

export default AppHeader

