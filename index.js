// Populate config into ENV
require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

app.use(morgan('tiny'))
app.use(bodyParser.json())

// ROUTES
const routes = {
  status: require('./routes/status'),
  compare: require('./routes/compare'),
  trend: require('./routes/trend')
}
Object.keys(routes).map(route => {
  app.use(`/${route}`, routes[route])
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

// LOOP for checking exchanges
