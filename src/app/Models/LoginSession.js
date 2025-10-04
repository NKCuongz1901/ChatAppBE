import mongoose from 'mongoose'

const loginSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    browser: {
      type: String,
      required: true,
    },
    browserVersion: String,
    operatingSystem: {
      type: String,
      required: true,
    },
    deviceType: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet'],
      default: 'desktop',
    },
    ipAddress: {
      type: String,
      required: true,
    },
    city: String,
    region: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    loginTime: {
      type: Date,
      default: Date.now,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userAgent: String,
    location: {
      address: String,
      countryCode: String,
      timezone: String,
    },
  },
  {
    timestamps: true,
  }
)

// Index để tìm kiếm phiên đăng nhập của user
loginSessionSchema.index({ userId: 1, loginTime: -1 })
loginSessionSchema.index({ userId: 1, isActive: 1 })

export default mongoose.model('LoginSession', loginSessionSchema)
