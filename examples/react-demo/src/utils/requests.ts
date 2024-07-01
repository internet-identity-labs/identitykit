export const getRequestObject = (requestJSON: string) => {
  const basicRequest = JSON.parse(requestJSON)
  return {
    method: basicRequest.method,
    params: basicRequest.params,
  }
}
