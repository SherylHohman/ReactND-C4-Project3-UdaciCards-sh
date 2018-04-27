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

export function retrieveDecks(){
  console.log('in api.retrieveDecks');
  return AsyncStorage.getItem(UDACICARDS_STORAGE_KEY)
    .then((results) => {
      // return results === (null || {})  // TESTING ONLY: Reset empty data to dummyData
      return results === null
        ? setDummyData()
        : JSON.parse(results)
        // : (console.log('results', results) || JSON.parse(results))
        // : setDummyData()  // TEMP TO RESET DB
    })
    .catch((err) => {
      // console.log('api.retrieveDecks AsyncStorage.getItem error:', err);
      console.error(err);
    })
  }

// export function getDeck(id){
//   return retrieveDecks
//     .then((decks) => {
//       // TODO: load results into store
//       return decks[id]
//     })
// }

export function saveDeckTitle(title){
  // title is stripped from special characters except _ and -
  // title is already verified to be unique (though maybe good to do again here, JIC)
  // -- thus I can use title as an id
  console.log('______entered api.saveDeckTitle______');

  const id = title;
  const newDeck = {
      [id]: {
        title,
        questions: []
      },
  };
  // console.log('____in api.js____, SaveDeckTitle before call AsyncStorage.mergeItem with newDeck:\n', newDeck);
  console.log('JSON.stringify(newDeck): \n', JSON.stringify(newDeck));

  return AsyncStorage
    .mergeItem(UDACICARDS_STORAGE_KEY, JSON.stringify(newDeck))

    // .then((newDeck) => {
    .then(() => {
      console.log('__returning newDeck: \n', newDeck, '\n');
      return newDeck;
    })

    .catch((err) => {
      err += '\n__AsyncStorage error in api.js, saveDeckTitle, Async.mergeItem \n..newDeck: ', newDeck;
      console.log('mergeItem err:', err);
      return err;
    });
    console.log('_Does this line get printed? newDeck:', newDeck);
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
  console.log('____in api.js__, removeDeck, key:', key);

  return retrieveDecks()
    .then((decksObj) => {

      decksObj[key] = undefined;
      delete decksObj[key];

      return AsyncStorage.setItem(UDACICARDS_STORAGE_KEY, JSON.stringify(decksObj))
        .then(() => decksObj)
    })

    .catch((err) => {
      console.log('____AsyncStorage error____ in api.js, removeDeck, in either getItem or setItem')
      return (err + ' key: ', key);
    });
};


//https://facebook.github.io/react-native/docs/asyncstorage.html
