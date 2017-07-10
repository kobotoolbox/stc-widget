import React from 'react';
import {bemComponents} from '../reactBemComponents';

const TIMER_PREPARED = 'TIMER_PREPARED';
const TIMER_INPROGRESS = 'TIMER_INPROGRESS';
const TIMER_COMPLETE = 'TIMER_COMPLETE';
const TIMER_MAX_REMAINING = 60;
const WORDS_PER_ROW = 10;

const bem = bemComponents({
  LitWidget: 'lit-widget',

  LitWidget__header: 'lit-widget__header',
  LitWidget__button: ['lit-widget__button', '<button>'],

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
      // stage: TIMER_INPROGRESS,
      stage: TIMER_PREPARED,
      remaining: TIMER_MAX_REMAINING,
      words: props.words,
    };
    this.toggleRowStatus = this.toggleRowStatus.bind(this);
  }
  componentWillUnmount = ()=> {
    clearInterval(this.interval);
  }
  start = ()=> {
    this.setState({
      stage: TIMER_INPROGRESS,
      remaining: TIMER_MAX_REMAINING,
    });
    this.interval = setInterval(this.tick, 1000);
  }
  tick = ()=> {
    this.setState({remaining: this.state.remaining - 1});
    if (this.state.remaining <= 0) {
      clearInterval(this.interval);
    }
  }
  finish = ()=> {
    this.props.onComplete(this.state.words.export());
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
        words: myWordsList.toggleWordStatus({index}, isCorrect)
      });
    }
  }
  render () {
    switch (this.state.stage) {
      case TIMER_PREPARED:
        return (
          <bem.LitWidget>
            <bem.LitWidget__header>
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
          
        return (
          <bem.LitWidget m={{promptingForValue}}>
            <bem.LitWidget__header>
              <bem.LitWidget__button onClick={this.finish}>
                {t('finish')}
              </bem.LitWidget__button>
              <bem.LitWidget__time>
                {this.state.remaining}
              </bem.LitWidget__time>
            </bem.LitWidget__header>
            <bem.LitWidget__wordlist>
              {words.map((word)=>{
                let index = word.get('index');
                return (
                    <bem.LitWidget__word m={`status-${word.get('status')}`}
                      onClick={this.clickWord}
                      data-index={index}
                      key={`word-${index}`}>
                      {word.get('text')}
                    </bem.LitWidget__word>
                  );
              })}
            </bem.LitWidget__wordlist>
            <bem.LitWidget__rowControls>
              {[...Array(rowsCount)].map((e, i) => <ToggleRowButton toggleRowStatus={this.toggleRowStatus} rowIndex={i} key={i}>Toggle</ToggleRowButton>)}
            </bem.LitWidget__rowControls>
          </bem.LitWidget>
        );
      case TIMER_COMPLETE:
        return (
          <bem.LitWidget m={{promptingForValue}}>
            <bem.LitWidget__header>
              <bem.LitWidget__time>
                {0}
              </bem.LitWidget__time>
            </bem.LitWidget__header>
            <bem.LitWidget__footer>
              footer text
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
    console.log("isCorrect: ", !this.state.isCorrect);
    this.setState({
      isCorrect: !this.state.isCorrect,
    }, ()=> this.props.toggleRowStatus(this.props.rowIndex, this.state.isCorrect));
  }
  render() {
    return (
      <button onClick={this.handleClick}>{t("Toggle")}</button>
    )
  }
}