import * as UdaciCardsAPI from '../../utils/api';
import * as deckActionTypes from './actionTypes';

// ACTION TYPES
// const {
//         REQUEST_DECKS,         FETCH_DECKS_SUCCESS,   FETCH_DECKS_FAILURE,
//         REQUEST_DECK,           FETCH_DECK_SUCCESS,    FETCH_DECK_FAILURE,
//         REQUEST_ADD_DECK,         ADD_DECK_SUCCESS,      ADD_DECK_FAILURE,
//         // REQUEST_EDIT_DECK,       EDIT_DECK_SUCCESS,     EDIT_DECK_FAILURE,
//         REQUEST_DELETE_DECK,   DELETE_DECK_SUCCESS,   DELETE_DECK_FAILURE,
//       } = deckActionTypes;
const {
        FETCH_DECK_SUCCESS, FETCH_DECK_FAILURE,
        ADD_DECK_SUCCESS,
        DELETE_DECK_SUCCESS,
      } = deckActionTypes;

// REGULAR ACTION CREATORS
  export function receivedDecks(decks){
    return {
      type: FETCH_DECKS_SUCCESS,
      decks,
    }
  };
  export function receiveDecksFailure(err){
    console.log('error fetching decks in actionCreators.js fetchDecks()');
    console.error(err);
    return{
      type: FETCH_DECKS_FAILURE,
      err,
      error: true,
    }
  };

    export function addDeck(deck){
    return {
      type: ADD_DECK_SUCCESS,
      deck,
    }
  };

    export function deleteDeck(id){
    return {
      type: DELETE_DECK_SUCCESS,
      id,
    }
  };


// THUNK ACTION CREATORS

  // export function fetchDecks(){
  //   return (dispatch) => {

  //     console.log('dispatcing request to fetch decks, in actionCreators.js fetchDecks()');
  //     dispatch({
  //       type: REQUEST_DECKS
  //     });

  //     UdaciCardsAPI.fetchDecks()
  //       .then((decks) => {
  //         console.log('have decks, now dispatcing to store, in actionCreators.js fetchDecks()');
  //         return (
  //           dispatch({
  //             type: FETCH_DECKS_SUCCESS,
  //             decks,
  //           })
  //         )}
  //       )

  //       .catch(err => {
  //         console.log('error fetching decks in actionCreators.js fetchDecks()');
  //         console.error(err);  //  in case of render error
  //         dispatch({
  //           type: FETCH_DECKS_FAILURE,
  //           err,
  //           error: true,
  //         })
  //       });

  //   };  // anon function(dispatch) wrapper
  // };

  // export function fetchDeck(deckId){
  //   return (dispatch) => {

  //     dispatch({
  //       type: REQUEST_DECK
  //     });

  //     UdaciCardsAPI.fetchDeck(deckId)
  //       .then((deck) => {
  //         return (
  //           dispatch({
  //             type: FETCH_DECK_SUCCESS,
  //             deck,
  //           })
  //         )}
  //       )

  //       .catch(err => {
  //         console.log('decks.fetchDeck .catch, ERR:', err);
  //         console.error(err);  //  in case of render error
  //         dispatch({
  //           type: FETCH_DECK_FAILURE,
  //           err,
  //           error: true,
  //         })
  //       })

  //   };  // anon function(dispatch) wrapper
  // };

  // export function addDeck(newDeckData){
  //   // newDeckData does not contain fields that are initialized by the server
  //   return (dispatch) => {

  //     dispatch({
  //       type: REQUEST_ADD_DECK
  //     });

  //     UdaciCardsAPI.addDeck(newDeckData)
  //       .then((data) => {

  //         return (
  //           dispatch({
  //             type: ADD_DECK_SUCCESS,
  //             deck: data,
  //           })
  //         )}
  //       )

  //       .catch(err => {
  //         console.error(err);  //  in case of render error
  //         dispatch({
  //           type: ADD_DECK_FAILURE,
  //           err,
  //           error: true,
  //         })
  //       });

  //   };  // anon function(dispatch) wrapper
  // };

  // export function editDeck(deckId, editedDeckData){
  //   return (dispatch) => {

  //     dispatch({
  //       type: REQUEST_EDIT_DECK
  //     });

  //     UdaciCardsAPI.editDeck(deckId, editedDeckData)
  //       .then((data) => {
  //         // data is the full (updated) deck object.

  //         return (
  //           dispatch({
  //             type: EDIT_DECK_SUCCESS,
  //             deck: data,
  //           })
  //         )}
  //       )

  //       .catch(err => {
  //         console.error(err);  //  in case of render error
  //         dispatch({
  //           type: EDIT_DECK_FAILURE,
  //           err,
  //           error: true,
  //         })
  //       });

  //   };  // anon function(dispatch) wrapper
  // };

  // export function deleteDeck(id){
  //   return (dispatch) => {

  //     dispatch({
  //       type: REQUEST_DELETE_DECK
  //     });

  //     UdaciCardsAPI.deleteDeck(id)
  //       .then((data) => {
  //         if (data.deleted !== true) {
  //           throw Error('Deck wasn\'t deleted, deckId: ' + data.id);
  //         }
  //         return (
  //           dispatch({
  //             type: DELETE_DECK_SUCCESS,
  //             id: data.id,
  //             categoryName: data.category,
  //           })
  //         )}
  //       )

  //       .catch(err => {
  //         console.error(err);  //  in case of render error
  //         dispatch({
  //           type: DELETE_DECK_FAILURE,
  //           err,
  //           error: true,
  //         })
  //       });

  //   };  // anon function(dispatch) wrapper
  // };

