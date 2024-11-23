import express from 'express'

import routerV1 from './v1'

// lấy ra bộ định tuyến để định nghĩa các tuyến đường
const router = express.Router()

// bản v1
router.use('/v1', routerV1)

export default router
