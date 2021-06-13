<template>
  <div>
    <div v-if="!name.length">
      <p>Enter your nickname</p>
      <input type="text" ref="name" @keyup.enter="saveName">
      <button @click="saveName">Continue</button>
    </div>
    <div v-else>

    <ul id="messages">
      <li v-for="message in messages" :key="message.id">
        <avatar :name="message.sender"></avatar>
        <p>{{message.sender}} says: {{ message.msg }}</p>
      </li>
    </ul>
      <button @click="name = ''"> Change nickname</button>
      <br>
      <input v-model="text" autocomplete="off" @keyup.enter="sendMessage"/>
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Avatar from './components/Avatar.vue'
export default {
  name: 'App',
  components: {
    // HelloWorld
    Avatar
  },
  data() {
    return {
      name: "",
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
      window.socket.emit('chat message', {id:new Date(), sender: this.name, msg:this.text});
      this.text = "";
    },
    messageReceiver: function() {
      window.socket.on('chat message', function(msg) {
        this.messages.push(msg);
        window.scrollTo(0, document.body.scrollHeight);
      }.bind(this));
    },
    saveName: function() {
      this.name = this.$refs.name.value;
    }
  }
}
</script>

<style>
</style>
