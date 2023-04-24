<template>
  <div id="app">
    <div class="output-area">
      <div v-for="(message, index) in messages" :key="index" class="message" :class="message.sender">
        {{ message.text }}
      </div>
    </div>
    <div class="input-area">
      <textarea
        v-model="userMessage"
        @input="autoResize"
        @keydown.enter="handleEnterKey"
        placeholder="Type here..."
      ></textarea>
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
    handleEnterKey(event) {
      if (!event.shiftKey) {
        event.preventDefault();
        this.messageInput = event.srcElement.value;
        event.srcElement.value = '';
        this.sendMessage();
      }
    },
    autoResize(event) {
      event.target.style.height = 'auto';
      event.target.style.height = event.target.scrollHeight + 'px';
    },

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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.output-area {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 16px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 16px;
}

.input-area {
  display: flex;
  background-color: #f2f2f2;
  padding: 8px;
  border-radius: 4px;
}

textarea {
  flex-grow: 1;
  border: none;
  resize: none;
  overflow: hidden;
  background-color: transparent;
  font-family: inherit;
  padding: 8px;
  border-radius: 4px;
  outline: none;
}

.message {
  margin-bottom: 8px;
}

.sender-user {
  text-align: left;
  color: #000;
}

.sender-bot {
  text-align: left;
  color: #3498db;
}

.button {
  background-color: #3498db;
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 0 0 0 10px;
  cursor: pointer;
  border-radius: 4px;
  padding: 8px;
}

.button:hover {
  background-color: #2980b9;
}


</style>

