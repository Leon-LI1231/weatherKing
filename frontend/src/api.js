// Base URL of the API. Point REACT_APP_API_URL at the Cloudflare Worker (edge/) to read
// through the edge cache; defaults to the local Spring Boot server.
export const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";
