import { AsyncStorage } from 'react-native';
import { Notifications, Permissions } from 'expo';

// NOTE: Notifications cannot be tested on IOS
//  neither on ios Simulator, nor on an ios phone running expo (as per Apple)
//  can only be tested on Android.
const NOTIFICATION_KEY = 'UdaciCards-SH-notifications';


export function clearLocalNotification () {
  return AsyncStorage.removeItem(NOTIFICATION_KEY)
    .then(Notifications.cancelAllScheduledNotificationsAsync)
}

function createNotification () {
  return {
    title: 'Test Your Memory!',
    body: "👋 Your UdaciCards are waiting!!..what's your best score ??",
    ios: {
      sound: true,
    },
    android: {
      sound: true,
      priority: 'high',
      sticky: false,
      vibrate: true,
    }
  }
}

export function setLocalNotification () {
  AsyncStorage.getItem(NOTIFICATION_KEY)
    .then(JSON.parse)
    .then((data) => {

      // if data has already been saved, do NOT set..
      if (data === null) {

        Permissions.askAsync(Permissions.NOTIFICATIONS)
          .then(({ status }) => {
            if (status === 'granted') {
              // in case notification for today/tomorrow has already been/is still set
              Notifications.cancelAllScheduledNotificationsAsync()

              // TODO: let user set the time
              //   TODO: Settings, Drawer Nav
              // Notification hard-coded for 10pm
              let tomorrow = new Date()
              tomorrow.setDate(tomorrow.getDate() + 1)
              tomorrow.setHours(20)
              tomorrow.setMinutes(0)

              Notifications.scheduleLocalNotificationAsync(
                createNotification(),
                {
                  time: tomorrow,
                  repeat: 'day',
                }
              )

              AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true))
            }
          })
      }
    })
}

// adds border outlines to styles to aid in UI layout design.
export function augmentStylesToVisualizeLayout(myStyles){

    const testingContainerStyle = {
              borderWidth: 2,
              borderColor: 'red',
          };
    const testingTextStyle = {
              borderWidth: 2,
              borderColor: 'blue',
          };
    const testingUnlabeledStyle = {
              borderWidth: 3,
              borderColor: 'yellow',
          };

    const styleKeys = Object.keys(myStyles);
    let testingStyles;
    const augmentedStyles = styleKeys.reduce((acc, key) => {

      if (key.toLowerCase().includes('container')){
        testingStyles = testingContainerStyle;
        // console.log('container, key:', key);
      } else if (key.toLowerCase().includes('text')){
        // console.log('text, key:', key);
        testingStyles = testingTextStyle;
      } else {
        // console.log('unlabeled, key:', key);
        testingStyles = testingUnlabeledStyle;
      }
      return {
        ...acc,
        [key]: {
          ...acc[key],
          ...testingStyles,
        },
      };
    }, myStyles);

    return augmentedStyles;
  }

export function collapseSpaces(str) {
  if (!str) return str;    // empty string, undefined, null
  return str.replace(/[\s]+/g, ' ');
}

export function stripInvalidChars(str){
  // only allow: digits, letters, spaces, '-' and '_'
  if (!str) return str    // empty string, undefined, null
  return str.replace(/[^\w_\-\s]+/g, '');
}

export function titleCase(str) {
  // donwside: doesn't allow for all caps (HTML), or camelCase words (eg iPhone) :-/
  if (!str) return str    // empty string, undefined, null
  str = collapseSpaces(str);
  return str.trim().toLowerCase().split(' ').map(function(word) {
      if (!word || word.length < 1) {
        return word;
      }
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
}

export function makeStringUnique(str, list=[]){
  // checks str for uniqueness against list, and augments with (digit) if necessary
  if (!str) return str;
  let count = 2;
  let newStr = str;
  while (list.indexOf(newStr) !== -1) {
    newStr = str + '-' + count.toString();
  }
  return newStr;
}
