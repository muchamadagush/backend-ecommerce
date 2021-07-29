const redis = require("redis")
const client = redis.createClient();

const hitCacheAllProduct = (req, res, next) => {
  const queryParameter = Object.values(req.query).length
  client.get('allProduct', (err, data) => {
    if (data !== null && queryParameter == 0) {
      const result = JSON.parse(data)
      console.log('data from redis')
      return res.status(200).send(result);
    } else {
      next()
    }
  })
}

const hitCacheProductId = (req, res, next) => {
  const id = req.params.id
  client.get(`v1/products/${id}`, (err, data) => {
    if (data !== null) {
      const result = JSON.parse(data)
      console.log(result)
      return res.status(200).json({ data: result});
    } else {
      next()
    }
  })
}

const clearRedisAllProduct = (req, res, next) => {
  client.del('allProduct')
  next()
}

const clearRedisProductId = (req, res, next) => {
  const id = req.params.id
  client.del(`v1/products/${id}`)
  next()
}

module.exports = {
  hitCacheAllProduct,
  hitCacheProductId,
  clearRedisAllProduct,
  clearRedisProductId
}