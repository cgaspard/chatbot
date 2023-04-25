<template>
  <div id="app">
    <div class="output-area">
      <div v-for="(message, index) in messages" :key="index" class="message" :class="message.type">
        {{ message.text }}
      </div>
    </div>
    <div class="input-area" ref="chatArea">>
      <textarea
        
        @input="autoResize"
        @keydown.enter="handleEnterKey"
        placeholder="Type here..."
      ></textarea>
      <!--<button @click="sendMessage">Send</button>  -->
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
  /* margin-top: 100px; */
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.output-area {
  flex-grow: .9;
  overflow-y: scroll;
  margin-bottom: 16px;
  /* border-bottom: 1px solid #9c9c9c; */
  padding-bottom: 16px;
  background-color: #e7e7e7;
  border-radius: 3px;
  text-align: left;
  padding: 10px;
}

.input-area {
  display: flex;
  background-color: #252525;
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
  font-size: 14pt;
  padding: 8px;
  border-radius: 15px;
  outline: none;
  color: #FFF;
      -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
}
.message {
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 18px;
  max-width: 100%;
  display: inline-block;
  position: relative;
  clear: both;
}

.message::after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.user {
  text-align: right;
  background-color: #04ec00;
  color: #ffffff;
}

.user::after {
  border-width: 10px 10px 0 0;
  border-color: #04ec00 transparent transparent transparent;
  top: 0;
  left: 0;
}

.bot {
  text-align: left;
  background-color: #3498db;
  color: #ffffff;
}

.bot::after {
  border-width: 10px 0 0 10px;
  border-color: #3498db transparent transparent transparent;
  top: 0;
  right: 0;
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
  border-radius: 6px;
  padding: 8px;
}

.button:hover {
  background-color: #2980b9;
}


</style>

