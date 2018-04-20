import { createSelector } from 'reselect';

// SELECTORS - Return memoized store data in format ready to be consumed by UI

// // export const getFetchStatus    = (store) => store.decks.fetchStatus;
// export const getFetchStatus = createSelector(
//   (store) => store.decks.fetchStatus,
//   (fetchStatus) => fetchStatus
// );

// export const getDecksAsObjects = (store) => store.decks.fetchedDecks;
export const getDecksAsObjects = createSelector(
  (store) => store.decks.fetchedDecks,
  (decksAsObjects) => decksAsObjects
);

// // called as (store)
// export const getDecks = createSelector(
//   getDecksAsObjects,
//   (deckObjects) => {
//     if (!deckObjects){ return []; }
//     // object to array
//     const decksArray = Object.keys(deckObjects).reduce((acc, deckId) => {
//       return acc.concat([deckObjects[deckId]]);
//     }, []);
//     return decksArray;
//   }
// );

// pass in 'store'
// returns array of {id, title, numCards} objects;
//   title is title of deck,
//   id is slug version of title
export const getDeckList = createSelector(
  getDecksAsObjects,
  (deckObjects) => {
    if (!deckObjects){ return []; }
    // decks object to array of titles and ids, and number of cards in the deck
    const decksArray = Object.keys(deckObjects).reduce((acc, deckId) => {
      return acc.concat([{
        id: deckId,
        title:deckObjects[deckId].title,
        numCards: deckObjects[deckId].questions.length,
      }]);
    }, []);
    return decksArray;
  }
);

// called as (store, id)
export const getDeckInfo = createSelector(
  getDecksAsObjects,
  (store, id) => id,
  (deckObjects, id) => {
    if (!deckObjects){ return []; }
    // decks object to array of titles and ids, and number of cards in the deck
    return{
      id,
      title:deckObjects[id].title,
      numCards: deckObjects[id].questions.length,
    };
  }
);

// called as (store, id)
export const getDeck = createSelector(
  getDecksAsObjects,
  (store, id) => id,
  (deckObjects, id) => {
    if (!deckObjects){ return []; }
    // decks object to array of titles and ids, and number of cards in the deck
    return{
      id,
      title:deckObjects[id].title,
      questions: deckObjects[id].questions,
      // numCards: deckObjects[id].questions.length,
    };
  }
);

// // pass in (store, id)
// export const getQuestions = createSelector(
//   getDecksAsObjects,
//   (store, id) => id,
//   (deckObjects, id) => {
//     return decks[id].questions;
//   }
// );

