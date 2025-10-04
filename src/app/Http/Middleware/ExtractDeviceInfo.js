import UAParser from 'ua-parser-js'
import requestIp from 'request-ip'

export function extractDeviceInfo(req, res, next) {
  try {
    const ip = requestIp.getClientIp(req)

    // Parse User Agent
    const userAgent = req.headers['user-agent'] || ''
    const parser = new UAParser(userAgent)
    const result = parser.getResult()

    req.deviceInfo = {
      browser: result.browser?.name || 'Unknown',
      browserVersion: result.browser?.version || '',
      operatingSystem: result.os?.name
        ? `${result.os.name} ${result.os.version || ''}`.trim()
        : 'Unknown',
      deviceType: result.device?.type || 'desktop',
      ipAddress:
        ip ||
        req.socket?.remoteAddress ||
        req.connection?.remoteAddress ||
        'Unknown',
      userAgent: userAgent,
    }

    next()
  } catch (error) {
    console.error('Error extracting device info:', error)
    req.deviceInfo = {
      browser: 'Unknown',
      browserVersion: '',
      operatingSystem: 'Unknown',
      deviceType: 'desktop',
      ipAddress: 'Unknown',
      userAgent: req.headers['user-agent'] || '',
    }
    next()
  }
}
