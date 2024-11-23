function createEventName(name) {
  return {
    ADD: name + 'add',
    ACCEPT: name + 'accept',
  }
}

const FriendEvent = createEventName('friends:')

export default FriendEvent
