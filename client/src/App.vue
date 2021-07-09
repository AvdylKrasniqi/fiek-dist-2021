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
          <div class="bg-black h-24 w-24">
              <video ref="webcamVideo"></video>
          </div>

          <div class="bg-black h-24 w-24">
              <video ref="remoteVideo"></video>
          </div>
          <div class="place-content-end flex flex-col h-screen overflow-y-scroll h-screen" ref="messagecontainer">
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
      messages: [],
      localStream: null,
      peer: null,
    }
  },
  mounted(){
    // socket = window.io();
    // window.socket = window.io("http://192.168.0.107:3000");
    window.socket = window.io("http://192.168.1.111:3000");
    this.pc = new RTCPeerConnection();
    this.messageReceiver();

  },
  methods: {
    sendMessage: function() {
      window.socket.emit('chat message', {id:new Date(), sender: this.name, msg:this.text});
      if(this.text == "/changenickname") {this.name = ""; }
      if(this.text == "/startvideo") this.startVideo();
      this.text = "";
    },
    messageReceiver: function() {
      window.socket.on('chat message', function(msg) {
        this.messages.push(msg);

        this.$refs.messagecontainer.scrollTop = this.$refs.messagecontainer.scrollHeight;

      }.bind(this));
    },
    saveName: function() {
      this.name = this.$refs.name.value;
    },

    connectToUser: function(userId, stream) {
      let call = this.peer.call(userId, stream);
      
      call.on("stream", (userVideoStream) => {
        this.$refs.remoteVideo.srcObject = userVideoStream;
        this.$refs.remoteVideo.play();
      });
    },

    startVideo: async function(){
      this.peer = new window.Peer(undefined, {
        path: "/peerjs",
        host: "/",
        port: "3000",
      });

      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(
        (stream) => {
          this.localStream = stream; 
          this.$refs.webcamVideo.srcObject = this.localStream;
          this.$refs.webcamVideo.play();

          this.peer.on("call", (call) => {
            call.answer(stream);
            call.on("stream", (userVideoStream) => {
              this.$refs.remoteVideo.srcObject = userVideoStream;
              this.$refs.remoteVideo.play();
            })
          });

          window.socket.on("user-connected", (userId) => {
            this.connectToUser(userId, stream)
          });

        }
      );


      this.peer.on("open", (id) => {
        window.socket.emit("join-room", id);
      });

    }
  }
}
</script>
<style>
</style>