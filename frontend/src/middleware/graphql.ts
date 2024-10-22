import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

export const auth_client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        //uri: process.env.REACT_APP_GRAPHQL_ENDPOINT_AUTH
        uri: import.meta.env.VITE_APP_GRAPHQL_ENDPOINT
    })
})
export const default_client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        //uri: process.env.REACT_APP_GRAPHQL_ENDPOINT_APP
        uri: import.meta.env.VITE_APP_GRAPHQL_ENDPOINT
    })
})
export const temp_client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        //uri: process.env.REACT_APP_GRAPHQL_ENDPOINT_APP
        uri: import.meta.env.VITE_APP_GRAPHQL_ENDPOINT_TEMP
    })
})