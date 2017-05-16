import React from 'react';
import DocumentTitle from 'react-document-title';
import { connect, PromiseState } from 'react-refetch';
import logo from './logo.svg';
import './App.css';

const TickerCard = ({tickerFetch}) => {
  if(tickerFetch.pending) {
    return <div>Loading</div>;
  } else if (tickerFetch.rejected) {
    return <div>Rejected</div>;
  } else if (tickerFetch.fulfilled) {
    const lastPrice = tickerFetch.value[6];
    return (
      <DocumentTitle title={lastPrice.toString()}>
        <div className="App-intro">
          <label htmlFor="">LTC/USD</label>
          <p><span>{lastPrice}</span></p>
        </div>
      </DocumentTitle>
    )
  } else {
    return <div>{<pre>{JSON.stringify(tickerFetch) }</pre>}</div>;
  }
};

const Ticker = connect(props => ({
  tickerFetch: {
    url: `https://api.bitfinex.com/v2/ticker/tLTCUSD`,
    refreshInterval: 2000
  }
}))(TickerCard);

const App = () => (
  <Ticker/>
)

export default App;
