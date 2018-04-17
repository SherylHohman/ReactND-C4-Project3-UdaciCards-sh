import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { Constants } from 'expo';

function AppStatusBar({ backgroundColor, ...props }){
  // backgroundColor blends with default statusbar color;
  //  default statusbar color is..
  //  on ios:  white => statusBarColor === background color
  //  android: gray  => statusBarColor a Darker Shade of background color
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
          backgroundColor="orange"
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
