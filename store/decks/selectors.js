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
// returns array of {id, title} objects;
//   title is title of deck,
//   id is slug version of title
export const getDeckList = createSelector(
  getDecksAsObjects,
  (deckObjects) => {
    if (!deckObjects){ return []; }
    // decks object to array of titles and ids
    const decksArray = Object.keys(deckObjects).reduce((acc, deckId) => {
      return acc.concat([{ id: deckId, title:deckObjects[deckId].title }]);
    }, []);
    return decksArray;
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

