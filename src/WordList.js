const UNREAD = 'UNREAD';
const CORRECT = 'CORRECT';
const IMPLIED_CORRECT = 'IMPLIED_CORRECT';
const INCORRECT = 'INCORRECT';

import {Map, fromJS, List} from 'immutable';


export class WordList {
  constructor (words) {
    this.words = fromJS(words.map((props, index) => {
      return Object.assign({
          status: UNREAD,
          time: null,
        }, props, {
          index: index,
        });
    }));
  }
  toggleWordStatus = ({index}) => {
    let status = CORRECT;
    let words = this.words;
    if ([CORRECT, IMPLIED_CORRECT].indexOf(words.getIn([index, 'status'])) > -1) {
      status = INCORRECT;
    }
    words = words.setIn([index, 'time'], new Date())
    words = words.setIn([index, 'status'], status);
    for (let i=0; i < index; i++) {
      if (words.get(i).get('status') === UNREAD) {
        words = words.setIn([i, 'status'], IMPLIED_CORRECT);
      }
    }
    this.words = words;
    if (index + 1 === words.size) {
      console.log('they have finished all the words. Are they ready to move on?')
    }
    return this;
  }
  export () {
    return {
      words: this.words.toJS(),
    }
  }
}
