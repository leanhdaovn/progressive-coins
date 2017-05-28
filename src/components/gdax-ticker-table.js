import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';

const USD_TO_SGD = 1.38;

const TickerCard = ({ticker}) => {
  const lastPrice = parseFloat(ticker.lastPrice);

  return (
    <tr>
      <td>{ticker.pair}</td>
      <td>{Number(lastPrice.toPrecision(5)).toLocaleString()}</td>
      <td>{Number((lastPrice * USD_TO_SGD).toPrecision(5)).toLocaleString()}</td>
      <td>{new Date(ticker.timeStamp).toString()}</td>
    </tr>
  )
};

const TickerList = ({ tickers = [] }) => {
  return (
    <div>
      <table>
          <th>Symbol</th>
          <th>Last price (USD)</th>
          <th>Last price (SGD)</th>
          <th>Time stamp</th>
        <tbody>
          { tickers.map(ticker => <TickerCard ticker={ticker} key={ticker.pair}/>) }
        </tbody>
      </table>
    </div>
  )
};

const productIds = [
    "BTC-USD",
    "ETH-USD",
    "LTC-USD"
];

const fetchPair = (product_id, cb) => {
  const apiUrl = `https://api.gdax.com/products/${product_id}/ticker`;
  fetch(apiUrl).then(response => {
    cb(response);
  });
};

const setTicker = (self, data) => {
  self.state.tickers[data.product_id] = {
    pair: data.product_id,
    lastPrice: data.price,
    side: data.side,
    timeStamp: data.time
  };
  self.forceUpdate();
}

class TickerTable extends Component {
  constructor(props) {
    super(props);
    let self = this;
    this.state = {tickers: {}};

    productIds.forEach((productId, index) => {
      setTimeout(() => {
        fetchPair(productId, response => {
          response.json().then(json => {
            setTicker(self, {product_id: productId, ...json});
          });
        })
      }, index * 400);
    });

    const ws = new WebSocket('wss://ws-feed.gdax.com');

    ws.onopen = () => {
      const msg = JSON.stringify({
        type: "subscribe",
        product_ids: productIds
      });
      let result = ws.send(msg);
    }

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.type == 'match'){
        setTicker(self, data);
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
