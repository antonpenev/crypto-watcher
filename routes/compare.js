const express = require('express')
const router = express.Router()
const ccxt = require('ccxt')

const exchangeIds = ['binance', 'kraken', 'gdax', 'poloniex', 'bittrex']

let exchanges = {}

router.get('/:asset', async function(req, res, next) {
  let result = []

  let symbol = req.params.asset

  console.log('searching for symbol ', symbol)

  await Promise.all(
    exchangeIds.map(async exchangeId => {
      let exchange = new ccxt[exchangeId]()

      let tickerResult = false
      try {
        tickerResult = await exchange.fetchTicker(`${symbol}/USD`)
      } catch (err) {
        try {
          tickerResult = await exchange.fetchTicker(`${symbol}/USDT`)
        } catch (e) {
          /* Not found anywhere */
        }
      }

      if (!tickerResult) {
        return
      }

      result.push({
        exchange: exchangeId,
        timestamp: tickerResult.timestamp,
        quoteVolume: tickerResult.quoteVolume,
        baseVolume: tickerResult.baseVolume,
        price: tickerResult.close
      })
    })
  )

  sortedResult = result.sort((a, b) => b.price - a.price)

  res.send({ data: sortedResult })
})

module.exports = router
