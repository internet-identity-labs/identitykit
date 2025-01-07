import React, { ReactNode } from "react"
import { methodServices } from "../service/method/method.servcie"
import { RPCMessage } from "../type"
import { methodComponents } from "../component/method/method.component"
import { accountService } from "../service/account.service"
import { NotSupportedError, exceptionHandlerService } from "../service/exception-handler.service"
import { authService } from "../service/auth.service"

export type UseSignerResponse = {
  component?: ReactNode
  state: State
}

export enum State {
  READY,
  LOADING,
  PROCESSING,
}

export const useSigner = (): UseSignerResponse => {
  const [component, setComponent] = React.useState<ReactNode | undefined>(undefined)
  const [state, setState] = React.useState<State>(State.READY)

  const handleMessage = React.useCallback(async (message: MessageEvent<RPCMessage>) => {
    try {
      console.debug("useSigner handleMessage:", message)

      if (!message.data.jsonrpc) {
        return
      }

      const methodService = methodServices.get(message.data.method)

      if (!methodService) {
        throw new NotSupportedError()
      }

      const componentData = await methodService.invokeAndGetComponentData(message)

      if (!componentData) {
        return
      }

      const methodComponent = componentData && methodComponents.get(componentData.method)

      const timeout: ReturnType<typeof setTimeout> = setTimeout(() => {
        setState(State.READY)
      }, 60000)

      const component =
        methodComponent && methodComponent.getComponent(componentData, setState, timeout)
      setComponent(component)
      setState(State.PROCESSING)
    } catch (error) {
      setState(State.LOADING)
      exceptionHandlerService.handle(error, message)
    }
  }, [])

  React.useEffect(() => {
    ;(async () => {
      window.addEventListener("message", handleMessage, false)
      await Promise.all([accountService.initWithPredefinedUsers(), authService.initPermissions()])
      console.debug("useSigner useEffect: The Ready message has been sent.")
    })()

    return () => window.removeEventListener("message", handleMessage)
  }, [handleMessage])

  return {
    component,
    state,
  }
}
