// Open the conversation at the newest message, as a chat app does.
const conversation = document.querySelector('#conversation')

if (conversation) {
  conversation.scrollTop = conversation.scrollHeight
}
