import React from 'react';

const USD_TO_SGD = 1.38;

const TickerCard = ({ticker}) => {
  const lastPrice = parseFloat(ticker.lastPrice);

  return (
    <tr>
      <td>{ticker.pair}</td>
      <td>{Number(lastPrice.toPrecision(5)).toLocaleString()}</td>
      <td>{Number((lastPrice * USD_TO_SGD).toPrecision(5)).toLocaleString()}</td>
      {
        ticker.changePercentage ?
        <td className={ ticker.changePercentage < 0 ? 'decrease' : 'increase'}>
          {Number((ticker.changePercentage*100).toFixed(2))}%
        </td> :
        <td>{new Date(ticker.timeStamp).toString()}</td>
      }
    </tr>
  )
};

const TickerList = ({ tickers = [] }) => {
  const ticker = tickers.length ? tickers[0] : {};
  return (
    <div>
      <table>
        <thead>
          <td>Symbol</td>
          <td>Last price (USD)</td>
          <td>Last price (SGD)</td>
          {
            ticker.changePercentage ?
            <td>24hrs change</td> :
            <td>Time stamp</td>
          }
        </thead>
        <tbody>
          { tickers.map(ticker => <TickerCard ticker={ticker} key={ticker.pair}/>) }
        </tbody>
      </table>
    </div>
  )
};

export default TickerList;
