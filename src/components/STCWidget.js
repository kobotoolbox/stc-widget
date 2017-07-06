import React from 'react';
import {bemComponents} from '../reactBemComponents';

const TIMER_PREPARED = 'TIMER_PREPARED';
const TIMER_INPROGRESS = 'TIMER_INPROGRESS';
const TIMER_COMPLETE = 'TIMER_COMPLETE';

const bem = bemComponents({
  LitWidget: 'lit-widget',

  LitWidget__header: 'lit-widget__header',
  LitWidget__button: ['lit-widget__button', '<button>'],

  LitWidget__wordlist: 'lit-widget__wordlist',
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
      remaining: 60,
      words: props.words,
    };
  }
  start = ()=> {
    log(`start the timer now for ${this.props.remaining} seconds`);
    this.setState({
      stage: TIMER_INPROGRESS,
      remaining: 60,
    });
  }
  finish = ()=> {
    this.props.onComplete({
      time: 0,
      words: false,
    })
  }
  clickWord = (event) => {
    let words = this.state.words;
    let index = +event.target.dataset.index;
    this.setState({
      words: words.toggleWordStatus({index})
    });
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
          words = this.state.words.words;
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
