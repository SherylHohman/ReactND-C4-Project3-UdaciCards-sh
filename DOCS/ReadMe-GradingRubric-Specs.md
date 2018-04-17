PROJECT SPECIFICATION
# Mobile Flashcards

## Application Setup

CRITERIA
MEETS SPECIFICATIONS
- Is the application easy to install and start?

The application requires only yarn install and yarn start to install and launch. npm can be used in place of yarn.

- Does the application include a README with clear installation and launch instructions?

A README is included with the project. The README includes clear instructions for installing and launching the project.

## Application Functionality

CRITERIA
MEETS SPECIFICATIONS
- Is the initial view a Deck List view?

The primary view, seen when the app loads, is a list of created decks which includes the name of each deck and the number of cards.

- Does the Deck List view function correctly?

Pressing on a deck in the list should generate an animation, and the app should route to an individual deck view.

- Does the Individual Deck view display the correct information?

The individual deck view includes (at a minimum):

-- The deck title
-- Number of cards in the deck
-- Option to start a quiz for that deck
-- Option to add a new question to the deck
-- Does the Individual Deck view function correctly?

Pressing the 'Start a Quiz' or 'Create New Question' button properly routes to the correct views for those activities.

- Does the New Question view function correctly?

The New Question view includes a form with fields for a question and answer, and a submit button.

Submitting the form correctly adds the question to the deck.

- Does the Quiz View function correctly?

The Quiz view starts with a question from the selected deck.
The question is display, along with a button to show the answer.
Pressing the 'Show Answer' button displays the answer.
Buttons are included to allow the student to mark their guess as 'Correct' or 'Incorrect'
The view displays the number of questions remaining.
When the last question is answered, a score is displayed. This can be displayed as a percentage of correct answers or just the number of questions answered correctly.
When the score is displayed, buttons are displayed to either start the quiz over or go back to the Individual Deck view.
Both the 'Restart Quiz' and 'Back to Deck' buttons route correctly to their respective views.
Does the New Deck view work correctly?

The view includes a form for creating a new deck - which should just be an input for the title and a 'Create Deck' button.

Pressing the button correctly creates the deck and routes the user to the Individual Deck view for the new deck.

Does the user receive a notification at a particular time if they haven't studied that day?

Logic for notification has been implemented. Notifications are generated at a specific time if the user hasn't completed at least one quiz for that day.

Does the app function correctly in either Android or iOS?

The app works correctly in either Android OR iOS devices (or emulator).

Project README identifies which platform(s) have been tested.

### Code Quality

CRITERIA
MEETS SPECIFICATIONS
Is the code well written and reasonably structured?

Project code uses reasonable naming conventions. Components are written for reuse and use a modular structure.

Does the project compile and run without error?

There are no build errors when starting the app. There are no errors while using the app.

