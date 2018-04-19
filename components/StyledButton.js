import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { white, primaryColor, primaryColorLight, primaryColorDark} from '../utils/colors';

export default function TextButton({ children, onPress, customColor }) {

  const backgroundColor = Platform.OS==='ios' ? white : customColor || primaryColorLight;
  const borderColor     = Platform.OS==='ios' ? customColor || primaryColorDark  : backgroundColor;
  const textColor       = Platform.OS==='ios' ? customColor || primaryColor  : white;

  const btnStyle = Platform.OS==='ios' ? styles.iosBtn : styles.androidBtn;
  const txtStyle = styles.txtDefault;

  const btnColor = { backgroundColor, borderColor };
  const txtColor = { color: textColor };

  return (
      <TouchableOpacity
        onPress={onPress}
        style={[btnStyle, btnColor]}
        >
        <Text
          style={[styles.txtDefault, txtColor]}
          >
          {children}
        </Text>
      </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  txtDefault: {
    textAlign: 'center',
    fontSize: 15,
    padding: 10,
  },
  iosBtn: {
    height: 45,
    borderRadius: 7,

    alignSelf:      'center',
    justifyContent: 'center',
    alignItems:     'center',

    // ios only settings
    borderColor:   primaryColorDark,
    borderWidth:   1,
    borderRadius:  3,

    paddingLeft:  25,
    paddingRight: 25,
  },
  androidBtn: {
    height: 45,
    borderRadius: 5,

    alignSelf:      'center',
    justifyContent: 'center',
    alignItems:     'center',

    // android- only settings
    marginLeft:  30,
    marginRight: 30,
    padding: 10,
  },

})


// ios has white buttons with colored outlines and colored text
// android has colored buttons with white text
// Pass in a button color, or it defaults to the App's primary colors
