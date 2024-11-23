function createEventName(name) {
  return {
    NEW: name + 'new',
    DELETE: name + 'delete',
  }
}

const MessageEvent = createEventName('messages:')

export default MessageEvent
