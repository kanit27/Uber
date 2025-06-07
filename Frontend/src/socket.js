import { io } from "socket.io-client";

// Use an environment variable for the server URL
const SERVER_URL = import.meta.env.REACT_APP_SERVER_URL || "http://localhost:4000"; 
const socket = io(SERVER_URL);

export default socket;