import React, { Component } from 'react';
import BitfinexTickerTable from './components/bitfinex-ticker-table';
import GdaxTickerTable from './components/gdax-ticker-table';
import './App.css';

const App = () => (
  <div>
    <div>
      <p>Coinbase</p>
      <GdaxTickerTable/>
    </div>
    <div>
      <p>Bitfinex</p>
      <BitfinexTickerTable/>
    </div>
  </div>
)

export default App;
