<template>
  <div>
    <div v-show="!name.length">
      <div class="flex justify-center items-center h-screen">
        <div class="text-center">
          <img class="w-96" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/University_of_Prishtina_logo.svg/1026px-University_of_Prishtina_logo.svg.png" alt="">
          <h1 class="text-2xl p-2" ref="nicknameInput" autofocus>Enter your nickname</h1>
          <input type="text" ref="name" @keyup.enter="saveName" class="input border border-gray-300 focus:outline-none p-2 px-3" placeholder="undefined, jk">
          <button @click="saveName" class="bg-red-500 p-2 px-5 text-white text-center">Continue</button>
        </div>
      </div>
    </div>
    <div v-show="name.length">
        <div class="place-content-end flex flex-col h-screen">
          <div class="place-content-end flex flex-col h-screen overflow-y-scroll h-screen" ref="messageContainer">
            <message v-for="message in messages" :key="message.id" :message="message"></message>
          </div>
        <div class="flex h-12">
        <input class="flex-1 border border-gray-300 px-2 focus:outline-none" v-model="text" autocomplete="off" @keyup.enter="sendMessage" placeholder="What's on your mind?"/>
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
    // window.socket = window.io("http://192.168.0.107:3000");
    window.socket = window.io("http://192.168.1.111:3000");
    this.messageReceiver();
  },
  methods: {
    sendMessage: function() {
      if(this.text == "/changenickname") {this.name = ""; }
      window.socket.emit('chat message', {id:new Date(), sender: this.name, msg:this.text});
      this.text = "";
    },
    messageReceiver: function() {
      window.socket.on('chat message', function(msg) {
        this.messages.push(msg);
        this.$refs.messageContainer.scrollTop =this.$refs.messageContainer.scrollHeight;
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