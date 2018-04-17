import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { Constants } from 'expo';
import { white, primaryColor } from './utils/colors';

function AppStatusBar({ backgroundColor, ...props }){
  // backgroundColor is blended with default OS statusBarColor;
  //  on ios  (white statusBarColor): ==> background color
  //  android (gray statusBarColor ): ==> a Darker Shade of background color
  return (
    <View style={{
            backgroundColor,
            height: Constants.statusBarHeight,
          }}
      >
      <StatusBar
        translucent
        backgroundColor={backgroundColor}
        {...props}
      />
    </View>
  );
}

export default class App extends React.Component {
  render() {
    return (
      <View style={{flex:1}}>
        <AppStatusBar
          backgroundColor={primaryColor}
          barStyle="light-content"
          />

        <View style={styles.container}>
          <Text>Welcome to UdaciCards !</Text>
          <Text> by Sheryl Hohman </Text>
        </View>
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
