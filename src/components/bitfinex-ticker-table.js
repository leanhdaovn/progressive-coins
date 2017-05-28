import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import TickerList from './ticker-list';

const symbols = ['tLTCUSD', 'tETHUSD', 'tBTCUSD', 'tXRPUSD', 'tZECUSD', 'tXMRUSD', 'tETCUSD'];

const setTicker = (self, channel, data) => {
  self.state.tickers[channel] = {
    ...self.state.tickers[channel],
    lastPrice: data[6],
    changePercentage: data[5]
  };
  self.forceUpdate();
}

class TickerTable extends Component {
  constructor(props) {
    super(props);
    let self = this;
    this.state = {tickers: {}};

    const ws = new WebSocket('wss://api.bitfinex.com/ws/2');

    ws.onopen = () => {
      symbols.forEach(symbol => {
        const msg = JSON.stringify({
          event: 'subscribe',
          channel: 'ticker',
          symbol: symbol
        });
        let result = ws.send(msg);
      });
    }

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data['event'] === 'subscribed') {
        self.state.tickers[data['chanId']] = {pair: data['symbol']};
      } else {
        const channel = data[0];
        const tickerData = data[1];
        if (tickerData && tickerData !== 'hb') {
          setTicker(self, channel, tickerData);
        }
      }
    };
  }

  render() {
    let tickers = [];
    for (var k in this.state.tickers) {
      tickers.push(this.state.tickers[k]);
    }
    tickers.sort((ticker1, ticker2) => ticker1.pair.localeCompare(ticker2.pair));

    return (
      <div>
        <TickerList tickers={tickers} />
      </div>
    )
  }
}

export default TickerTable;
