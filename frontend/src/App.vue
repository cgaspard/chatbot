<template>
  <div id="app">
    <div class="chat-area" ref="chatArea">
      <div v-for="(message, index) in messages" :key="index">
        <strong>{{ message.type === 'user' ? 'You: ' : 'Bot: ' }}</strong>{{ message.text }}
      </div>
    </div>
    <div class="input-area">
      <input v-model="messageInput" @keyup.enter="sendMessage" placeholder="Type your message" />
      <input type="number" step="0.1" min="0" max="1" v-model="temperature" placeholder="Temperature" /> <!-- Add this line -->
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      messageInput: '',
      messages: [],
      temperature: 0.5,
    };
  },
  methods: {
    async sendMessage() {
      const message = this.messageInput.trim();
      if (!message) return;

      this.messages.push({ type: 'user', text: message });
      this.messageInput = '';

      const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message, temperature: this.temperature }), // Pass the temperature value
      });

      const data = await response.json();
      this.messages.push({ type: 'bot', text: data.reply });
      this.scrollToBottom();
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatArea = this.$refs.chatArea;
        chatArea.scrollTop = chatArea.scrollHeight;
      });
    },
  },
};
</script>
<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    display: flex;
    flex-direction: column;
    height: 100vh;
    margin: 100px; /* Add this line to create a margin around the app */
    box-sizing: border-box; /* Add this line to ensure the margin doesn't cause overflow */
  }
  .chat-area {
    flex: 1;
    overflow-y: auto;
    padding: 1rem; /* Add this line to create a padding inside the chat area */
  }
  .input-area {
    display: flex;
  }
  input {
    flex: 1;
  }
  /* Dark mode styles */
  body,
  input,
  button {
    background-color: #333;
    color: #fff;
  }
</style>

