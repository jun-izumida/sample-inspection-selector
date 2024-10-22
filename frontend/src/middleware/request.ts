import { default_client, temp_client } from "../middleware/graphql"

export const graphqlQuery = (query: any, input: any, callback: any, successCallback: any, errorCallback: any) => {
  default_client.query({
    fetchPolicy: 'network-only',
    query: query,
    variables: input
  }).then((result: any) => {
    successCallback(result)
    return
  }).catch(error => {
    errorCallback(error)
  }).finally(() => {
    callback()
  })
}

export const graphqlMutation = (query: any, input: any, callback: any, successCallback: any, errorCallback: any) => {
  default_client.mutate({
    mutation: query,
    variables: input,
  }).then((result: any) => {
    successCallback(result)
    return
  }).catch(error => {
    errorCallback(error)
    console.log(error)
  }).finally(() => {
    callback()
  })
}

export const graphqlQueryTemp = (query: any, input: any, callback: any, successCallback: any, errorCallback: any) => {
  temp_client.query({
    fetchPolicy: 'network-only',
    query: query,
    variables: input
  }).then((result: any) => {
    successCallback(result)
    return
  }).catch(error => {
    errorCallback(error)
  }).finally(() => {
    callback()
  })
}
