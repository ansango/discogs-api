import { createServer } from './server.js'

const PORT = Number(process.env.PORT ?? 3000)
const app = createServer()

console.log(`\n🪐 Discogs API Scalar Docs Explorer running at http://localhost:${PORT}`)
console.log(`📖 OpenAPI spec available at http://localhost:${PORT}/openapi.json\n`)

export default {
	port: PORT,
	fetch: app.fetch,
}
