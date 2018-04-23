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
  const id = title;
  AsyncStorage.mergeItem(UDACICARDS_STORAGE_KEY, JSON.stringify({
    [id]: {
      title,
      questions: []
    },
  }));
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

// export function updateDeckTitle( {id, title} ){
//   AsyncStorage.getItem(id)
//   .then((results) => {
//     const decks = JSON.parse(results);
//     const updatedDeck = {
//       ...decks[id],
//       title,
//     }
//     AsyncStorage.setItem(UDACICARDS_STORAGE_KEY, JSON.stringify(updatedDeck));
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
// export function removeDeck( {deckId} ){
//   AsyncStorage.getItem(deckId)
//   .then((results) => {
//     const data = JSON.parse(results);
//     data[deckId] = undefined;
//     delete data[deckId];
//     AsyncStorage.setItem(UDACICARDS_STORAGE_KEY, JSON.stringify(data));
//   });
// };

//https://facebook.github.io/react-native/docs/asyncstorage.html
