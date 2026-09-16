export type EnvironmentalState = {
  temperature: number
  apparentTemperature: number
  humidity: number
  windSpeed: number
  cloudCover: number
  weatherCode: number
  observedAt: string
  heatRisk: number
  riskBand: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME'
  exposureSignal: number
  confidence: number
}

const DELHI = { latitude: 28.6139, longitude: 77.209, timezone: 'Asia/Kolkata' }

export async function observeDelhi(): Promise<EnvironmentalState> {
  const params = new URLSearchParams({
    latitude: String(DELHI.latitude),
    longitude: String(DELHI.longitude),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,cloud_cover,weather_code',
    timezone: DELHI.timezone,
  })

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
  if (!response.ok) throw new Error(`Weather observation failed: ${response.status}`)
  const data = await response.json()
  const current = data.current

  const temperature = Number(current.temperature_2m)
  const apparentTemperature = Number(current.apparent_temperature)
  const humidity = Number(current.relative_humidity_2m)
  const windSpeed = Number(current.wind_speed_10m)
  const cloudCover = Number(current.cloud_cover)

  const thermalLoad = clamp((apparentTemperature - 24) / 22, 0, 1)
  const humidityLoad = clamp((humidity - 45) / 50, 0, 1)
  const lowWindPenalty = clamp((4 - windSpeed) / 4, 0, 1)
  const cloudPenalty = clamp((65 - cloudCover) / 65, 0, 1)

  const heatRisk = Math.round(clamp(
    thermalLoad * 0.55 + humidityLoad * 0.18 + lowWindPenalty * 0.12 + cloudPenalty * 0.15,
    0,
    1,
  ) * 100)

  const riskBand = heatRisk >= 80 ? 'EXTREME' : heatRisk >= 60 ? 'HIGH' : heatRisk >= 35 ? 'MODERATE' : 'LOW'
  const exposureSignal = Math.round(clamp(45 + heatRisk * 0.52, 0, 100))

  return {
    temperature,
    apparentTemperature,
    humidity,
    windSpeed,
    cloudCover,
    weatherCode: Number(current.weather_code),
    observedAt: String(current.time),
    heatRisk,
    riskBand,
    exposureSignal,
    confidence: 0.78,
  }
}

export function simulateIntervention(state: EnvironmentalState, intervention: 'vegetation' | 'cool-roofs' | 'shade'): EnvironmentalState & { delta: number } {
  const reduction = intervention === 'vegetation' ? 0.11 : intervention === 'cool-roofs' ? 0.08 : 0.06
  const delta = Math.max(1, Math.round(state.heatRisk * reduction))
  const heatRisk = Math.max(0, state.heatRisk - delta)
  const riskBand = heatRisk >= 80 ? 'EXTREME' : heatRisk >= 60 ? 'HIGH' : heatRisk >= 35 ? 'MODERATE' : 'LOW'
  return { ...state, heatRisk, riskBand, delta, confidence: Math.max(0.6, state.confidence - 0.05) }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
