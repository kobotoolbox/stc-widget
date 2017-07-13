const UNREAD = 'UNREAD';
const CORRECT = 'CORRECT';
// const IMPLIED_CORRECT = 'IMPLIED_CORRECT';
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
    // this.milestoneWord = null;
  }
  toggleWordStatus = ({index}, isCorrect=true) => {
    let status = (isCorrect) ? CORRECT : INCORRECT;
    let words = this.words;
    if (words.getIn([index, 'status']) === CORRECT) {
      status = INCORRECT;
    }
    words = words.setIn([index, 'time'], new Date())
    words = words.setIn([index, 'status'], status);
    for (let i=0; i < index; i++) {
      if (words.get(i).get('status') === UNREAD) {
        words = words.setIn([i, 'status'], CORRECT);
      }
    }
    this.words = words;
    if (index + 1 === words.size) {
      console.log('they have finished all the words. Are they ready to move on?');
    }
    return this;
  }
  countWordsByStatus = (passedStatus) => {
    const wordsFiltered = this.words.toJS().filter(word => {
      return word.status == passedStatus;
    });
    console.log(wordsFiltered);
    return wordsFiltered.length;
  }
  setMilestoneWord = (index) => {
    this.milestoneWord = this.words.get(index);
  }
  export () {
    return {
      words: this.words.toJS(),
      milestoneWord: this.milestoneWord.toJS(),
    }
  }
}
