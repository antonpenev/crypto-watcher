const express = require('express')
const router = express.Router()

const indicators = require('technicalindicators')
const ccxt = require('ccxt')

router.get('/:asset/:market/:time?', async function(req, res, next) {
  let exchange = new ccxt['binance']()

  const { asset, market, time } = req.params

  let endTimestamp = +new Date()
  if (time) {
    let endTimestamp = exchange.parse8601(time)
  }

  limit = 300

  // get XXX hours since
  const hours = 4
  let startTimestamp = endTimestamp - 3600 * 300 * 1000 * hours
  console.log('startTimestamp', startTimestamp, endTimestamp)
  const ohlcv = await exchange.fetchOHLCV(`${asset}/${market}`, hours + 'h', startTimestamp, 300)
  console.log('ohlcv length', ohlcv.length)
  let stockData = {
    open: [],
    high: [],
    close: [],
    low: [],
    volume: []
  }

  ohlcv.map(candle => {
    stockData.open.push(candle[1])
    stockData.high.push(candle[2])
    stockData.low.push(candle[3])
    stockData.close.push(candle[4])
    stockData.volume.push(candle[5])
  })

  const closePrices = ohlcv.map(price => price[4])

  let isTrendingUp = await indicators.isTrendingUp({ values: stockData.close })
  let isTrendingDown = await indicators.isTrendingDown({ values: stockData.close })
  let predictPattern = await indicators.predictPattern({ values: stockData.close })

  let trend = false
  if (isTrendingDown) {
    trend = 'down'
  } else if (isTrendingUp) {
    trend = 'up'
  }

  // patterns
  let patternsResult = {}

  try {
    patternsResult = Object.assign(patternsResult, {
      abandonedbaby: await indicators.abandonedbaby(stockData)
    })
  } catch (err) {
    console.log('abandones err', err)
  }

  try {
    patternsResult = Object.assign(patternsResult, {
      hasHeadAndShoulder: await indicators.hasHeadAndShoulder({ values: stockData.close })
    })
  } catch (err) {
    console.log('headAndShoulders err', err)
  }

  try {
    patternsResult = Object.assign(patternsResult, {
      threeblackcrows: await indicators.threeblackcrows(stockData)
    })
  } catch (err) {
    console.log('abandones err', err)
  }

  let result = {
    trend,
    predictPattern,
    patterns: patternsResult
  } // 'up' / 'down'

  res.send(result)
})

module.exports = router
