class UserGenderEnum {
  static SECRET = 0
  static FEMALE = 1
  static MALE = 2
  static LGBT = 3

  static allName() {
    return {
      [this.SECRET]: 'bí mật',
      [this.FEMALE]: 'nữ',
      [this.MALE]: 'nam',
      [this.LGBT]: 'lgbt',
    }
  }

  static getNameByValue(value) {
    return this.allName()[value]
  }

  static getValueByName(name) {
    return Object.keys(this.allName()).find((key) => this.allName()[key] === name)
  }
}

export default UserGenderEnum
