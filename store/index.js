import { combineReducers } from 'redux';
import decks from './decks/reducers';

const rootReducer = combineReducers({
  decks,
});

export default rootReducer;

// TODO: create root Selectors
