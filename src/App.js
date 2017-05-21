import React from 'react';
import DocumentTitle from 'react-document-title';
import { connect, PromiseState } from 'react-refetch';
import logo from './logo.svg';
import './App.css';

const TickerCard = ({ticker}) => (
  <tr>
    <td>{ticker[0]}</td>
    <td>{ticker[7]}</td>
  </tr>
);

const TickerList = ({ tickersFetch }) => {
  if(tickersFetch.pending) {
    return <div>Loading</div>;
  } else if (tickersFetch.rejected) {
    return <div>Rejected</div>;
  } else if (tickersFetch.fulfilled) {
    const tickers = tickersFetch.value;
    return (
      <div>
        <DocumentTitle title={tickers[0][7].toString()}>
        </DocumentTitle>
        <table>
        { tickersFetch.value.map(ticker => <TickerCard ticker={ticker}/>) }
        </table>
      </div>

    )
  } else {
    return <div>{<pre>{JSON.stringify(tickersFetch) }</pre>}</div>;
  }
};

const Ticker = connect(props => ({
  tickersFetch: {
    url: `https://api.bitfinex.com/v2/tickers?symbols=tLTCUSD,tETHUSD,tXRPUSD,tBTCUSD`,
    refreshInterval: 2000
  }
}))(TickerList);

const App = () => (
  <Ticker/>
)

export default App;
