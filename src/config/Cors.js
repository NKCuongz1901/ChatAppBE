import CorsOrigin from '../app/Models/CorsOrigin'

const corsOptions = {
  origin: async (origin, callback) => {
    if (origin === undefined) {
      callback(null, true)
      return
    }

    const corsOrigin = await CorsOrigin.findOne({ domain: origin })

    if (corsOrigin) {
      callback(null, true)
      return
    }

    callback(new Error('Not allowed by CORS'))
  },
}

export default corsOptions
