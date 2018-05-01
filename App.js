import React from 'react';

import { StyleSheet, Text, View,
         StatusBar, Platform,
         AsyncStorage,
       } from 'react-native';

import { TabNavigator, StackNavigator } from 'react-navigation';
import { Constants } from 'expo';
import { Entypo } from '@expo/vector-icons';

// Components
import DeckList from './components/DeckList';
import Deck from     './components/Deck';
import Quiz from     './components/Quiz';
import NewDeck from  './components/NewDeck';
import NewCard from  './components/NewCard';

// Constants, Helpers, Api's
import { setLocalNotification } from './utils/helpers'
import { white, primaryColor } from './utils/colors';

// hide react-native deprecation warnings in emulator
import {YellowBox} from 'react-native';
console.disableYellowBox = true;


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

  componentDidMount() {
    setLocalNotification();
  }

  render(){
    return (
      <View style={{flex:1}}>
        <AppStatusBar
          backgroundColor={primaryColor}
          barStyle="light-content"
          />
        <MainNavigation />
      </View>
    );
  }
}

const Tabs = TabNavigator(
  // this first argument defines the tabs; First Tab Gets auto loaded/selected
  {
    DeckList: {
      screen: DeckList,
      navigationOptions: {
        tabBarLabel: 'Deck List',
        tabBarIcon: ({ tintColor }) =>  // icons only show in ios
          <Entypo name='list' size={30} color={tintColor} />
      },
    },
    NewDeck: {
      screen: NewDeck,
      navigationOptions: {
        tabBarLabel: 'Create New Deck',
        tabBarIcon: ({ tintColor }) => // icons only show in ios
          <Entypo name='add-to-list' size={30} color={tintColor} />
      },
    },
  },
  // this second argument sets the various options
  {
    navigationOptions: {
      // do-not-display page headers for Tab Navigation
      header: null
    },

    tabBarOptions: {
      // ios icon and text color; android text color
      activeTintColor:   Platform.OS === 'ios' ? primaryColor : white,

      // no effect on ios; on android this color blends with tab color
      pressColor: white,

      // little underline thingy on selected tab in android
      indicatorStyle: {
        backgroundColor: white, //primaryColor,//primaryColorDark,  // default is yellow
        // height: 3,  // defaults to 2
      },

      style: {
        height: 56,
        // color for (selected AND not selected) tabs
        backgroundColor: Platform.OS === 'ios' ? white  : primaryColor,

        shadowColor: 'rgba(0, 0, 0, 0.24)',
        shadowOffset: {
          width: 0,
          height:     Platform.OS === 'ios' ? 3 : 0,
        },
        shadowRadius: Platform.OS === 'ios' ? 6 : 0,
        shadowOpacity: 1,
      }
    }
  }
);

const stackScreenNavigationOptions = {
  // color of the "back" arrow
  headerTintColor:   white,
  headerStyle: {
    // background color for the header
    backgroundColor: primaryColor,
  }
};

// creates a component
const MainNavigation = StackNavigator(
  //  RouteConfigs: This is analogous to defining Routes in a web app
  {
    Home: {
      screen: Tabs,  // Which also loads the first Tab (DeckList)
    },
    Deck: {
      screen: Deck,
      navigationOptions: stackScreenNavigationOptions,
    },
    Quiz: {
      screen: Quiz,
      navigationOptions: stackScreenNavigationOptions,
    },
    NewDeck: {
      screen: NewDeck,
      navigationOptions: stackScreenNavigationOptions,
    },
    NewCard: {
      screen: NewCard,
      navigationOptions: stackScreenNavigationOptions,
    },
  },
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
