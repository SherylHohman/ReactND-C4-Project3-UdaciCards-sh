import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { white, primaryColor, primaryColorDark } from '../utils/colors';

export default class NewQuestion extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Add A New Question</Text>
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


  const textInputProps = {
    /* onChange={(title) => this.setState({ title })} */  // similar to onChangeText
    maxLength: 25,
    multiline: true,
    autoFocus: true,     /* takes focus at componentDidMount, saves the user a click */
    autoCorrect: false,  //ios only -- but it does Not seem to be working on ios
    returnKeyType: "done",
    // TODO: pull keyboard up automatically if phone does Not have Physical keyboard
    // TODO: get height of soft Kyeboard
    //       - edit layout design to render in the area unoccupied by the
    //         keyboard (even when it is not showing),
    //         but allow it to take up more vertical space if needed,
    //         (but only while keyboard is *not* showing)
    //         also add scrollView just in case, so user can access hidden content.

    /* onEndEditing={(title) => this.setState({title: title.trim()})} */
    /* onBlur={(title) => this.setState({title: title.trim()})} */
    /* clearButtonMode={"while-editing"} */
    /* returnKeyType = {"next"} */
    /* ref={ref => {this._emailInput = ref}} */
    /* placeholder="email@example.com" */
    /* autoCapitalize="none" */
    /* keyboardType="email-address" */
    /* returnKeyType="send" */
    /* onSubmitEditing={this._submit} */
  };

  // Options for `behavior` : enum('height', 'position', 'padding')
    // Note: Android and iOS both interact with this prop differently.
    // Android may behave better when given no behavior prop at all,
    // whereas iOS is the opposite.
  const keyboardAvoidingViewProps = {
    // keyboardVerticalOffset: Platform.OS === 'ios' ? 40 : 0,
    // behavior: Platform.OS === 'ios' ? 'padding' : '',
    // behavior: Platform.OS === 'ios' ? 'padding' : 'height',
    // behavior: Platform.OS === 'ios' ? 'padding' : 'position',
    behavior: 'padding',
  };
  // TODO: keyboardAvoidingView is still wonky on android.
  //   - tried many options, and wrapping various segments both individually,
  //     and in various group combinations.  This is the best so far.
  //     But.. on Nexus 6P emulator, with Android 23,
  //     it Partially covers the infoText/label "Title for your.."
  //     - it would be better to cover it *completely* (or not at all)
  //     The next best was to wrap *all* the elements in a single keyboardAvoidingBiew,
  //     .. but then the infoText/label "Title for your.." Never Shows At All
  //        on either platform, whether or not the keyboard is visible !
  //        also, both the input and submit button are at the top with tons of whitespace below.
  //     This whole keyboard thing seems quite finicky !!
  //   - keyboardVerticalOffset seemed to have *No* effect, no matter the number
  //   - despite the docs suggestions, only "padding" seemed to have any effect
  //       on Android
  //
  //   ..Ahh, it seems to be an issue with font size - with large font, the
  //     input font overlaps the text above.  With a small font, this does not
  //     happen.  So.. look into options regulating input box, padding/margin,
  //     in the TextInput documentation.  Not much else to do about *that* in
  //     keyboardAvoiding..
  //
  //   - Additionally, fudge around with all the styles a bit more.
  //     styles for this component ought to be simplified anyway.
