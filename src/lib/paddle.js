import { initializePaddle } from "@paddle/paddle-js"

const PADDLE_ENVIRONMENT = import.meta?.env?.VITE_PADDLE_ENV || "sandbox"
const PADDLE_CLIENT_TOKEN = import.meta?.env?.VITE_PADDLE_CLIENT_TOKEN || ""
const PADDLE_MONTHLY_PRICE_ID = import.meta?.env?.VITE_PADDLE_MONTHLY_PRICE_ID || ""
const PADDLE_YEARLY_PRICE_ID = import.meta?.env?.VITE_PADDLE_YEARLY_PRICE_ID || ""

let paddlePromise

export const getPaddleConfig = () => ({
  environment: PADDLE_ENVIRONMENT === "production" ? "production" : "sandbox",
  clientToken: PADDLE_CLIENT_TOKEN,
  monthlyPriceId: PADDLE_MONTHLY_PRICE_ID,
  yearlyPriceId: PADDLE_YEARLY_PRICE_ID
})

export const isPaddleConfigured = () => {
  const config = getPaddleConfig()
  return Boolean(
    config.clientToken &&
      config.monthlyPriceId &&
      config.yearlyPriceId
  )
}

export const getCheckoutPriceId = (plan) => {
  const config = getPaddleConfig()
  return plan === "yearly" ? config.yearlyPriceId : config.monthlyPriceId
}

export const getPaddleInstance = async (eventCallback) => {
  const config = getPaddleConfig()
  if (!config.clientToken) {
    throw new Error("Paddle client token is missing.")
  }

  if (!paddlePromise) {
    paddlePromise = initializePaddle({
      environment: config.environment,
      token: config.clientToken,
      eventCallback
    })
  }

  const paddle = await paddlePromise

  if (!paddle) {
    throw new Error("Failed to initialize Paddle.")
  }

  if (eventCallback) {
    paddle.Update({
      eventCallback
    })
  }

  return paddle
}
