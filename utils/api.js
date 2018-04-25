import { AsyncStorage } from 'react-native';

export const UDACICARDS_STORAGE_KEY = 'UdaciCards-SH:decks'

function setDummyData () {

  const dummyData =

    {
      React: {
        title: 'React',
        questions: [
          {
            question: 'What is React?',
            answer: 'A library for managing user interfaces'
          },
          {
            question: 'Where do you make Ajax requests in React?',
            answer: 'The componentDidMount lifecycle event'
          }
        ]
      },
      JavaScript: {
        title: 'JavaScript',
        questions: [
          {
            question: 'What is a closure?',
            answer: 'The combination of a function and the lexical environment within which that function was declared.'
          }
        ]
      }
    }

  AsyncStorage.setItem(UDACICARDS_STORAGE_KEY, JSON.stringify(dummyData))

  return dummyData
}

export function fetchDecks(){
  return AsyncStorage.getItem(UDACICARDS_STORAGE_KEY)
    .then((results) => {
      return results === null
        ? setDummyData()
        : JSON.parse(results)
    })
    // .catch((err) => {
    //   console.log('AsyncStorage error in api.js, fetchDecks, in getItem');
    //   return (err);
    // });
  }

// export function getDeck(id){
//   return fetchDecks
//     .then((decks) => {
//       // TODO: load results into store
//       return decks[id]
//     })
// }

export function saveDeckTitle(title){
  // title is stripped from special characters except _ and -
  // title is already verified to be unique (though maybe good to do again here, JIC)
  // -- thus I can use title as an id
  console.log('entered api.saveDeckTitle..');

  const id = title;
  const newDeck = {
      [id]: {
        title,
        questions: []
      },
  };
  console.log('in api.js, SaveDeckTitle before call AsyncStorage.mergeItem with newDeck:\n', newDeck);
  console.log('JSON.stringify(newDeck): \n', JSON.stringify(newDeck));

  AsyncStorage
    .mergeItem(UDACICARDS_STORAGE_KEY, JSON.stringify(newDeck))
    .then(() => {
      console.log('..in api.saveDeckTitle, onSubmit, after calling asynchStoreage.merge..');
      // console.log('..mergeItemReturnValue: \n', mergeItemReturnValue||null);
      console.log('..returning newDeck: \n', newDeck);
      return newDeck;
    })
    .catch((err) => {
      err += '\n..AsyncStorage error in api.js, saveDeckTitle, Async.mergeItem \n..newDeck: ', newDeck;
      console.log('mergeItem err:', err);
      return err;
    });
  return newDeck;
};

// // Note, `title` *could* be ambiguous, so I'm taking in `id` instead
// // card is presumed to be an object of format { question: questionString, answer: answerString }
// export function addCardToDeck({ id, card }){
//   AsyncStorage.mergeItem(UDACICARDS_STORAGE_KEY, JSON.stringify({
//     id: questions.concat([card]),
//   }));
// };

// export function updateCard( {deckId, cardIndex, card} ){
//   AsyncStorage.getItem(deckId)
//   .then((results) => {
//     const data = JSON.parse(results);
//     const deck = data[deckId];
//     const updatedDeck = {
//       ...deck,
//       questions: [
//       ...deck.questions.slice(0, cardIndex),
//       card,
//       ...deck.questions.slice(cardIndex+1)
//       ]
//     }

//     AsyncStorage.setItem(UDACICARDS_STORAGE_KEY, JSON.stringify(updatedDeck));
//   });
// };

// export function updateDeckTitle( {oldTitle, newTitle} ){
//   // title is used as id, so need to delete old object,
//   // _after_ save new object
//   const oldId = oldTitle;
//   const newId = newTitle;

//   AsyncStorage.getItem(oldId)
//   .then((results) => {
//     const deck = JSON.parse(results);
//     const updatedDeck = {
//       [newId]: {
//         title: newTitle,
//         questions: deck[oldId].questions,
//       },
//     }

//     AsyncStorage.setItem(UDACICARDS_STORAGE_KEY, JSON.stringify(updatedDeck))
//     .then(() => {
//       AsyncStorage.removeItem(UDACICARDS_STORAGE_KEY, oldId)

//       // AsyncStorage.removeItem('token', (err) => console.log('finished', err));

//     });
//   });
// };

// export function removeCard( {deckId, cardIndex} ){
//   AsyncStorage.getItem(deckId)
//   .then((results) => {
//     const data = JSON.parse(results);
//     data[deckId] = undefined;
//     delete data[deckId];
//     AsyncStorage.setItem(UDACICARDS_STORAGE_KEY, JSON.stringify(data));
//   });
// };

export function removeDeck(key){
  console.log('in api.js, removeDeck, key:', key);
  AsyncStorage.getItem(UDACICARDS_STORAGE_KEY)
  .then((results) => {
    const decks = JSON.parse(results);
    console.log('got decks with keys:', Object.keys(decks));
    console.log('deleting decks[key]:', decks[key]);
    decks[key] = undefined;
    // console.log('set decks[key] to undefined:', decks[key]);
    delete decks[key];
    console.log('setting decks with keys:', Object.keys(decks));
    AsyncStorage.setItem(UDACICARDS_STORAGE_KEY, JSON.stringify(decks));
    console.log('exiting api.js, removeDeck, returning decks:', decks);
    return decks;
  })
  .catch((err) => {
    console.log('AsyncStorage error in api.js, removeDeck, in either getItem or setItem')
    return (err + ' key: ', key);
  });
};
// export function removeDeck(id){
//   console.log('in api.js, removeDeck, id:', id);
//   AsyncStorage.getItem(id)
//   .then((results) => {
//     const data = JSON.parse(results);
//     data[id] = undefined;
//     delete data[id];
//     console.log('about to removeItem from storage, deleted data:', data);
//     // AsyncStorage.setItem(UDACICARDS_STORAGE_KEY, JSON.stringify(data))
//     AsyncStorage.removeItem(UDACICARDS_STORAGE_KEY, id)

//     .then(() => {
//       console.log('deleted');
//       return id;
//     })
//     .catch((err) => {console.log('error deleting from storage,', err)});
//   });
// };
// export function removeDeck(id){
//   console.log('in api.js, removeDeck, id:', id);
//   fetchDecks()
//   .then((results) => {
//     const decks = JSON.parse(results);
//     const deck = decks[id];
//     deck = undefined;
//     delete deck;
//     console.log('about to removeItem from storage, deleted deck:', deck, '\ndecks:',decks);
//     // AsyncStorage.setItem(UDACICARDS_STORAGE_KEY, JSON.stringify(data))
//     AsyncStorage.removeItem(UDACICARDS_STORAGE_KEY, id)

//     .then(() => {
//       console.log('deleted');
//       return id;
//     })
//     .catch((err) => {console.log('error deleting from storage,', err)});
//   });
// };


//https://facebook.github.io/react-native/docs/asyncstorage.html
