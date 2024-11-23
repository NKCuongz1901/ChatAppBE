class MessageTypeEnum {
  static TEXT = 0
  static IMAGE = 1
  static FILE = 2
  static EMOJI = 3

  static allName() {
    return {
      [this.TEXT]: 'văn bản',
      [this.IMAGE]: 'hình ảnh',
      [this.FILE]: 'tệp tin',
      [this.EMOJI]: 'emoji',
    }
  }

  static getNameByValue(value) {
    return this.allName()[value]
  }
}

export default MessageTypeEnum
