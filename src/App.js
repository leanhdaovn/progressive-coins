import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import logo from './logo.svg';
import './App.css';

const USD_TO_SGD = 1.4;

const TickerCard = ({ticker}) => (
  <tr>
    <td>{ticker.symbol}</td>
    <td>{ticker.tick[6]}</td>
    <td>{ticker.tick[6] * USD_TO_SGD}</td>
  </tr>
);

const TickerList = ({ tickers = [] }) => {
  const ltc = tickers.find(ticker => ticker.symbol === 'tLTCUSD');

  return (
    <div>
      <table>
        <thead>
          <th>Symbol</th>
          <th>Last price (USD)</th>
          <th>Last price (SGD)</th>
        </thead>
        <tbody>
          { tickers.map(ticker => <TickerCard ticker={ticker} key={ticker.symbol}/>) }
        </tbody>
      </table>
      <DocumentTitle title={ltc ? ltc.tick[6].toString() : ''}></DocumentTitle>
    </div>
  )
};

const symbols = ['tLTCUSD', 'tETHUSD', 'tBTCUSD', 'tXRPUSD', 'tZECUSD', 'tXMRUSD', 'tETCUSD'];

class Ticker extends Component {
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
      // console.log(data);

      if (data['event'] === 'subscribed') {
        self.state.tickers[data['chanId']] = {symbol: data['symbol']};
      } else {
        const channel = data[0];
        const tickerData = data[1];
        if (tickerData && tickerData !== 'hb') {
          // console.log(channel);
          // console.log(self.state.tickers);
          self.state.tickers[channel]['tick'] = tickerData;
          self.forceUpdate();
        }
      }
    };
  }

  render() {
    let tickers = [];
    for (var k in this.state.tickers) {
      tickers.push(this.state.tickers[k]);
    }
    tickers.sort((ticker1, ticker2) => ticker1.symbol.localeCompare(ticker2.symbol));

    return (
      <div>
        <TickerList tickers={tickers} />
      </div>
    )
  }
}

const App = () => (
  <Ticker/>
)

export default App;
