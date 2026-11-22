// Hacer coneccion al socket
import io from "socket.io-client";

// In Next.js, env vars accessible in the browser MUST be prefixed with NEXT_PUBLIC_
const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_SOCKETS || 'http://localhost:4000';

const socket = io(SOCKET_URL, {
    // autoConnect: false so SSR doesn't try to open a WebSocket on the server side.
    // Connection is initiated manually in Header.tsx once the userId is available.
    autoConnect: false,
});

export default socket;