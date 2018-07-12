## ENDPOINTS

### `/trend/:ASSET/:MARKET`

Returns ML prediction for given asset and market.

Example:
`/trend/BTC/USDT` will return:

```
{
  trend: "down",
  preddiectedPattern: {
    pattern: "TD",
    patternId: 0,
    probability: 99.8835563659668
  }
}
```

You could also pass specific end date:
`/trend/:ASSET/:MARKET/2018-04-02T04:00:00`

### `/compare/:ASSET`

For asset returns prices from several exchanges. First row is the biggest price.

Example:
`/compare/XRP` will return:

```
{
  data: [
    {
      exchange: "kraken",
      timestamp: 1524117953868,
      quoteVolume: 8780669.61001824,
      baseVolume: 12503868.69105036,
      price: 0.7246
    },
    {
      exchange: "bittrex",
      timestamp: 1524117950463,
      quoteVolume: 4825498.37546831,
      baseVolume: 6855802.18144903,
      price: 0.7244
    },
    {
      exchange: "poloniex",
      timestamp: 1524117952256,
      quoteVolume: 6560564.67128004,
      baseVolume: 9419288.77812509,
      price: 0.72399873
    }
  ]
}
```
