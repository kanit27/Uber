import { io } from "socket.io-client";


const socket = io("https://uber-production-4170.up.railway.app");

export default socket;