import React from 'react';
import {bemComponents} from '../reactBemComponents';

const TITLE_TEXT = t("ORF KoBo test");
const TIMER_PREPARED = 'TIMER_PREPARED';
const TIMER_INPROGRESS = 'TIMER_INPROGRESS';
const TIMER_COMPLETE = 'TIMER_COMPLETE';
const WORDS_PER_ROW = 10;
const NOTIFICATION_CLASS='show-notification';
const OPERATORS = {
  "==": (x, y) => { return x == y; },
  "===": (x, y) => { return x === y; },
  ">": (x, y) => { return x > y; },
  "<": (x, y) => { return x < y; },
  "<=": (x, y) => { return x <= y; },
  ">=": (x, y) => { return x >= y; },
  "!=": (x, y) => { return x != y; },
  "!==": (x, y) => { return x !== y; },
}
const bem = bemComponents({
  LitWidget: 'lit-widget',

  LitWidget__header: 'lit-widget__header',
  LitWidget__button: ['btn',  '<button>'],
  LitWidget__title: 'lit-widget__title',
  LitWidget__notification: 'lit-widget__notification',

  LitWidget__body: 'lit-widget__body',
  LitWidget__footer: 'lit-widget__footer',

  LitWidget__wordlist: 'lit-widget__wordlist',
  LitWidget__rowControls: 'lit-widget__rowControls',
  LitWidget__word: 'lit-widget__word',

  LitWidget__time: 'lit-widget__time',
});


// a placeholder function to wrap strings which will need translation
function t(str) { return str; }

export class STCWidget extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      stage: TIMER_PREPARED,
      remaining: this.props.seconds,
      words: props.words,
    };
    this.initialNotificationState = Object.freeze({ 
      message: null,
      shown: false,
      code: null,
    });
    this.flashNotification = this.initialNotificationState;
    this.toggleRowStatus = this.toggleRowStatus.bind(this);
  }
  componentWillUnmount = ()=> {
    clearInterval(this.interval);
  }
  start = ()=> {
    this.setState({
      stage: TIMER_INPROGRESS,
      remaining: this.props.seconds,
    });
    this.interval = setInterval(this.tick, 1000);
  }
  tick = ()=> {
    const remaining = this.state.remaining - 1;
    if(remaining >= 0) {
      this.setState({ remaining, }, ()=> {
        this.props.actions.map(action => {
          if(this.state.remaining == action.time) {
            this.triggerAction(action);
          }
        });
      });
    }
  }
  checkActionCondition(condition) {
    if(condition != null) {
      const count = this.state.words.countWordsByStatus(condition.status);
      // Returns the results of the count vs condition.value based on the passed condition string
      // The condition string is used to locate the comparaison function since all those functions are stored in the OPERATORS array
      // that's indexed using the operator
      // for example OPERATORS['==='] would result in a function that checks whether count === condition.value.
      return OPERATORS[condition.operator](count, condition.value);
    }else{
      return true;
    }
  }
  triggerAction = (action) => {
    if(this.checkActionCondition(action.wordsCondition)){
      if(action.code == 'time_out'){
        this.finish();
      }else{
        this.flash(action);
      }
    }
  }
  finish = ()=> {
    this.setState({ stage: TIMER_COMPLETE, }, ()=> {
      this.props.onComplete(this.state.words.export())
    });
    clearInterval(this.interval);
  }
  flash = (notification) => {
    this.flashNotification = {
      message: notification.message,
      shown: true,
      code: notification.code,
    }
  }
  clickWord = (event) => {
    let words = this.state.words;
    let index = +event.target.dataset.index;
    this.setState({
      words: words.toggleWordStatus({index})
    });
  }
  toggleRowStatus = (rowIndex, isCorrect) => {
    let myWordsList = this.state.words;
    const start = rowIndex * WORDS_PER_ROW,
    end = (start + WORDS_PER_ROW <= myWordsList.words.size) ? start + WORDS_PER_ROW : myWordsList.words.size;
    for (var index = start ; index < end; index++) {
      this.setState({
        words: myWordsList.toggleWordStatus({index}, isCorrect),
      });
    }
  }
  setMilestoneWord = (index) => {
    this.state.words.setMilestoneWord(index, this.state.remaining);
    this.setState({
      words: this.state.words.toggleWordStatus({index})
    });
    this.flashNotification = this.initialNotificationState;
  }
  formatTime = (time) => {
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = time % 60;
    var formattedTime = "";
    if (hrs > 0) {
        formattedTime += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    formattedTime += "" + mins + ":" + (secs < 10 ? "0" : "");
    formattedTime += "" + secs;
    return formattedTime;
  }
  render () {
    switch (this.state.stage) {
      case TIMER_PREPARED:
        return (
          <bem.LitWidget>
            <bem.LitWidget__header>
              <bem.LitWidget__title>
                <h2>{TITLE_TEXT}</h2>
              </bem.LitWidget__title>
              <bem.LitWidget__button onClick={this.start}>
                {t('Start')}
              </bem.LitWidget__button>
            </bem.LitWidget__header>
          </bem.LitWidget>
        );
      case TIMER_INPROGRESS:
        let promptingForValue = false,
          words = this.state.words.words,
          rowsCount = Math.ceil(words.size / WORDS_PER_ROW);
        const widgetClassName = (this.flashNotification.shown) ? NOTIFICATION_CLASS: '';
        return (
          <bem.LitWidget m={{promptingForValue}} className={ `${widgetClassName} ${this.flashNotification.code}` }>
            <bem.LitWidget__header>
              <bem.LitWidget__title>
                <h2>{TITLE_TEXT}</h2>
              </bem.LitWidget__title>
              <bem.LitWidget__time>
                {this.formatTime(this.state.remaining)}
              </bem.LitWidget__time>
            </bem.LitWidget__header>
            {this.flashNotification.shown && <bem.LitWidget__notification>{this.flashNotification.message} </bem.LitWidget__notification>}
            <bem.LitWidget__body>
              <bem.LitWidget__wordlist>
                {words.map((word)=>{
                  let index = word.get('index');
                  return (
                      <bem.LitWidget__word m={`status-${word.get('status')}`}
                        onClick={this.clickWord}
                        data-index={index}
                        key={`word-${index}`}>
                        <div className="question">
                          { this.flashNotification.code == 'select_current_word' && <input type="checkbox" onClick={() => this.setMilestoneWord(index)}/> }
                        </div>
                        {word.get('text')}
                      </bem.LitWidget__word>
                    );
                })}
              </bem.LitWidget__wordlist>
              <bem.LitWidget__rowControls>
                {[...Array(rowsCount)].map((e, i) => <ToggleRowButton toggleRowStatus={this.toggleRowStatus} rowIndex={i} key={i}>Toggle</ToggleRowButton>)}
              </bem.LitWidget__rowControls>
            </bem.LitWidget__body>
            <bem.LitWidget__footer>
              <bem.LitWidget__button onClick={this.finish}>
                {t('Finish')}
              </bem.LitWidget__button>
            </bem.LitWidget__footer>
          </bem.LitWidget>
        );
      case TIMER_COMPLETE:
        const correctWordsCount = this.state.words.countWordsByStatus('CORRECT');
        const wordsPerMinute = (60 * correctWordsCount / this.state.remaining).toFixed(2);
        const finalMilestoneWord = this.state.words.getMilestone();
        const CWPM = ((finalMilestoneWord.index - finalMilestoneWord.incorrectAtMilestone) * (60/finalMilestoneWord.milestoneTime)).toFixed(2)
        return (
          <bem.LitWidget m={{promptingForValue}}>
            <bem.LitWidget__header>
              <bem.LitWidget__title>
                <h2>{TITLE_TEXT}</h2>
              </bem.LitWidget__title>
              <bem.LitWidget__time>
                {0}
              </bem.LitWidget__time>
            </bem.LitWidget__header>
            <bem.LitWidget__footer>
              <h3>{t('Finished')}</h3>
              <p>{t('The student read a total of:')} {correctWordsCount}  {t('words correctly')}</p>
              <p>{t('The student read at a rate of:')} {wordsPerMinute}  {t('words per minute')}</p>
              <h4>{t('Statistics:')}</h4>
              <p>Text: {finalMilestoneWord.text}</p>
              <p>Status: {finalMilestoneWord.status}</p>
              <p>Index: {finalMilestoneWord.index}</p>
              <p>Incorret at Milestone: {finalMilestoneWord.incorrectAtMilestone}</p>
              <p>CWPM: {CWPM}</p>
              
            </bem.LitWidget__footer>
          </bem.LitWidget>
        );
    }
  }
}

class ToggleRowButton extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isCorrect: true,
    };
  }
  handleClick = () => {
    this.setState({
      isCorrect: !this.state.isCorrect,
    }, ()=> this.props.toggleRowStatus(this.props.rowIndex, this.state.isCorrect));
  }
  render() {
    return (
      <button onClick={this.handleClick}><i className={(this.state.isCorrect) ? 'fa fa-toggle-off' : 'fa fa-toggle-on'}></i></button>
    )
  }
}