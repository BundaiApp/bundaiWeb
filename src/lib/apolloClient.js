import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { LOCAL_GRAPHQL_URL, TOKEN_STORAGE_KEY, isLocalRuntime } from './auth'

const getGraphqlUri = () => {
  const configuredUri = import.meta?.env?.VITE_GRAPHQL_URL
  if (configuredUri) {
    return configuredUri
  }

  return isLocalRuntime() ? LOCAL_GRAPHQL_URL : 'https://api.bundai.app/graphql'
}

const httpLink = createHttpLink({
  uri: getGraphqlUri(),
})

const authLink = setContext((_, { headers }) => {
  let token = null

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      token = window.localStorage.getItem(TOKEN_STORAGE_KEY)
    }
  } catch {
    token = null
  }

  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {})
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

export default client
