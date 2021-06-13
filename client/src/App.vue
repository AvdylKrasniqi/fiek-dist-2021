<template>
  <div>
    <ul id="messages">
      <li v-for="message in messages" :key="message.id">
        <p>{{ message.msg }}</p>
      </li>
    </ul>
    <input v-model="text" autocomplete="off" @keyup.enter="sendMessage"/>
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld
  },
  data() {
    return {
      text: "",
      socket: null,
      messages: []
    }
  },
  mounted(){
    // socket = window.io();
    window.socket = window.io("http://192.168.0.107:3000");
    this.messageReceiver();
  },
  methods: {
    sendMessage: function() {
      window.socket.emit('chat message', {id:new Date(), msg:this.text});
      this.text = "";
    },
    messageReceiver: function() {
      window.socket.on('chat message', function(msg) {
        this.messages.push(msg);
        window.scrollTo(0, document.body.scrollHeight);
      }.bind(this));
    }
  }
}
</script>

<style>
</style>
