import UploadController from '@/app/Http/Controllers/UploadController'
import { validateUser } from '@/app/Http/Middleware/ValidateUserMiddleware'
import MulterConfig from '@/config/Multer'
import express from 'express'

// lấy ra bộ định tuyến để định nghĩa các tuyến đường
const uploadRouter = express.Router()

uploadRouter.post(
  '/single',
  validateUser,
  MulterConfig.single('file'),
  UploadController.uploadSingleFile
)

uploadRouter.delete('/single', UploadController.deleteSingleFile)
export default uploadRouter
