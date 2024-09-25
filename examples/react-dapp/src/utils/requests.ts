export const getRequestObject = (requestJSON: string) => {
  const basicRequest = JSON.parse(requestJSON)
  const params = basicRequest.params
    ? {
        params: basicRequest.params,
      }
    : {}
  return {
    method: basicRequest.method,
    params,
  }
}
