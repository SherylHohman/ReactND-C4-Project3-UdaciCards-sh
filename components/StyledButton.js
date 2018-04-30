import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { white, gray, primaryColor, primaryColorLight, primaryColorDark} from '../utils/colors';

export default function TextButton({ children, onPress=null, customColor='', disabled=false }) {

  const disabledColor = disabled ? gray : null;

  const backgroundColor = Platform.OS==='ios' ? white : disabledColor || customColor || primaryColorLight;
  const borderColor     = Platform.OS==='ios' ? disabledColor || customColor || primaryColorDark
                                              : disabledColor || backgroundColor;
  const textColor       = Platform.OS==='ios' ? disabledColor || customColor || primaryColor  : white;

  const btnStyle = Platform.OS==='ios' ? styles.iosBtn : styles.androidBtn;
  const txtStyle = styles.txtDefault;

  const btnColor = { backgroundColor, borderColor };
  const txtColor = { color: textColor };

  return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
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
    // because of bleeding of white text to colored background on android,
    // enlarge text (or increase fontWeight) for better readability
    fontSize: Platform.OS==='ios' ? 15 : 18,
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
    // padding accepts clicks, margin === no-click zone
    // ..for some reason, padding is much wider than margin, when given the same number (so decreased from 30 to 15)
    // also enlarge pading to accomodate for larger text to maintain visual balance
    padding: 20,
    paddingLeft:  15,
    paddingRight: 15,
  },

})

// ios has white buttons with colored outlines and colored text
// android has colored buttons with white text
// Pass in a button color, or it defaults to the App's primary colors

TextButton.propTypes = {
  // children, onPress=null, customColor='', disabled=false
  onPress:     PropTypes.func,
  customColor: PropTypes.string,
  disabled:    PropTypes.bool,
  children:    PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,  // a react element
  ]),
};


