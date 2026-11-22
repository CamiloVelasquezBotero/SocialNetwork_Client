import axios from "axios";

// En Next.js, process.env.NEXT_PUBLIC_* está disponible tanto en el server como en el cliente.
// AXIOS_BASEURL solo está disponible en el server, por eso usamos una detección simple:
const baseURL = typeof window !== 'undefined'
    ? window.location.origin   // En el browser usamos el origen actual (ej: http://localhost:3000)
    : process.env.AXIOS_BASEURL || 'http://localhost:3000'

const api = axios.create({
    baseURL
})

export default api
