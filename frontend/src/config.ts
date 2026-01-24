interface ApiConfig {
  API_URL: string
}

interface Config {
  api: ApiConfig
}

const config: Config = {
  api: {
    API_URL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  },
}

export default config
