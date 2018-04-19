import { combineReducers } from 'redux';

// Action Types
import * as actionTypes from './actionTypes';

// ACTION TYPES
const {
        REQUEST_DECKS,         FETCH_DECKS_SUCCESS,   FETCH_DECKS_FAILURE,
        // REQUEST_DECK,           FETCH_DECK_SUCCESS,    FETCH_DECK_FAILURE,
        // REQUEST_ADD_DECK,         ADD_DECK_SUCCESS,      ADD_DECK_FAILURE,
        // REQUEST_EDIT_DECK,       EDIT_DECK_SUCCESS,     EDIT_DECK_FAILURE,
        // REQUEST_DELETE_DECK,   DELETE_DECK_SUCCESS,   DELETE_DECK_FAILURE,
      } = actionTypes;

// INITIAL STATE
  const decksInitialState = {};

// SAMPLE DATA
    // {
    //   React: {
    //     title: 'React',
    //     questions: [
    //       {
    //         question: 'What is React?',
    //         answer: 'A library for managing user interfaces'
    //       },
    //       {
    //         question: 'Where do you make Ajax requests in React?',
    //         answer: 'The componentDidMount lifecycle event'
    //       }
    //     ]
    //   },
    //   JavaScript: {
    //     title: 'JavaScript',
    //     questions: [
    //       {
    //         question: 'What is a closure?',
    //         answer: 'The combination of a function and the lexical environment within which that function was declared.'
    //       }
    //     ]
    //   }
    // }


// REDUCERS

  // state is an object of (multiple) deck objects
  function fetchedDecks(state=decksInitialState, action) {
    switch (action.type){

      // case REQUEST_DECK:
      // case REQUEST_DECKS:
      // case REQUEST_ADD_DECK:
      // // case REQUEST_EDIT_DECK:
      // // case REQUEST_DELETE_DECK:
      //   return state;

      case FETCH_DECKS_SUCCESS:
        // fetch All decks, AND
        // fetch decks by Category
        // REPLACES all decks in store with current fetched results
        // return action.decks;
        return ({
          ...state,         // future proofing
          ...action.decks,
        });

      // case FETCH_DECK_SUCCESS:
      //   return ({
      //     ...state,
      //     [action.deck.id]: action.deck,
      //    });

      // case ADD_DECK_SUCCESS:
      //   return ({
      //     ...state,
      //     // adds a new id and object to the decks object (quasi-list)
      //     [action.deck.id]: {
      //       ...action.deck,
      //     },
      //   });

      // case EDIT_DECK_SUCCESS:
        // return ({
        //   ...state,
        //    [action.deck.id]: {
        //     ...action.deck,
        //    }
        // });
      // case DELETE_DECK_SUCCESS:
        // let newState = {...state};
        // delete newState[action.id]
        // return newState;

      // case FETCH_DECK_FAILURE:
      // case FETCH_DECKS_FAILURE:
      // case ADD_DECK_FAILURE:
      // // case EDIT_DECK_FAILURE:
      // // case DELETE_DECK_FAILURE:
      //   return state;

      default:
        return state;
    }
  }

  // const fetchStatusInitialState = {
  //   isLoading: false,
  //   isFetchFailure: false,
  //   errorMessage: '',
  // }
  // function fetchStatus(state=fetchStatusInitialState, action) {
  //   switch (action.type){

  //     case REQUEST_DECKS:
  //     case REQUEST_ADD_DECK:
  //     // case REQUEST_EDIT_DECK:
  //     // case REQUEST_DELETE_DECK:
  //     case REQUEST_DECK:
  //       return ({
  //         ...state,
  //         isLoading: true,
  //         isFetchFailure: false,
  //         errorMessage: '',
  //       })
  //     case FETCH_DECK_SUCCESS:
  //     case FETCH_DECKS_SUCCESS:
  //     case ADD_DECK_SUCCESS:
  //     // case EDIT_DECK_SUCCESS:
  //     // case DELETE_DECK_SUCCESS:
  //       return ({
  //         ...state,
  //         isLoading: false,
  //         isFetchFailure: false,
  //         errorMessage: '',
  //        });
  //     case FETCH_DECK_FAILURE:
  //     case FETCH_DECKS_FAILURE:
  //     case ADD_DECK_FAILURE:
  //     // case EDIT_DECK_FAILURE:
  //     // case DELETE_DECK_FAILURE:
  //       return ({
  //         ...state,
  //         isLoading: false,
  //         isFetchFailure: true,
  //         errorMessage: action.err,
  //       })

  //     default:
  //       return state;
  //   }
  // }

const decks = combineReducers({
  fetchedDecks,
  // fetchStatus,
});

export default decks
