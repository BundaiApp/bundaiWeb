import posthogJs from 'posthog-js'

const apiKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY
const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

let identifiedDistinctId = null

if (typeof window !== 'undefined' && apiKey) {
  posthogJs.init(apiKey, {
    api_host: host,
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
    persistence: 'localStorage+cookie',
  })
}

function syncDistinctId(distinctId, properties) {
  if (!distinctId || typeof window === 'undefined') {
    return
  }

  if (identifiedDistinctId !== distinctId) {
    posthogJs.identify(distinctId, properties)
    identifiedDistinctId = distinctId
    return
  }

  if (properties && Object.keys(properties).length > 0) {
    posthogJs.setPersonProperties(properties)
  }
}

const posthog = {
  capture({ distinctId, event, properties } = {}) {
    if (!event || typeof window === 'undefined') {
      return
    }

    syncDistinctId(distinctId)
    posthogJs.capture(event, properties)
  },

  identify({ distinctId, properties } = {}) {
    if (!distinctId || typeof window === 'undefined') {
      return
    }

    syncDistinctId(distinctId, properties)
  },

  captureException(error, distinctId) {
    if (!error || typeof window === 'undefined') {
      return
    }

    syncDistinctId(distinctId)
    posthogJs.captureException(error)
  },

  reset() {
    if (typeof window === 'undefined') {
      return
    }

    identifiedDistinctId = null
    posthogJs.reset()
  },
}

export default posthog
