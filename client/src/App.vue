<template>
  <div>
    <div v-if="!name.length">
      <p>Enter your nickname</p>
      <input type="text" ref="name" @keyup.enter="saveName">
      <button @click="saveName">Continue</button>
    </div>
    <div v-else>
        <div class="place-content-end flex flex-col h-screen">
          <div class="place-content-end flex flex-col h-screen overflow-y-scroll h-screen">
            <message v-for="message in messages" :key="message.id" :message="message"></message>
          </div>
        <div class="flex h-12">
        <button @click="name = ''"> Change nickname</button>
        <br>
        <input class="flex-1" v-model="text" autocomplete="off" @keyup.enter="sendMessage"/>
        <button class="bg-red-500 p-2 px-5 text-white text-center" @click="sendMessage">Send</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import HelloWorld from './components/HelloWorld.vue'
import Message from './components/Message.vue'
export default {
  name: 'App',
  components: {
    // HelloWorld
    Message
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
