import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'

createApp(App).mount('#app')

window.server = {
    iceServers: [
        {
            urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"]
        }
    ],
    iceCandidatePoolSize: 10,
}


window.pc = new RTCPeerConnection();
window.localStream = null;
window.remoteStream = null;