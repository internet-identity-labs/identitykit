import { Loader } from "./component/loader.component"
import { State, useSigner } from "./hook/use-signer"

function App() {
  const { component, state } = useSigner()

  return (
    <div className="flex items-center justify-center min-h-[100vh]">
      <div className="flex flex-col justify-center w-[450px] h-[640px] bg-white dark:bg-black sm:border border-neutral-300 rounded-md">
        {State.LOADING === state || State.READY == state || !component ? (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="pt-[58px] pb-[30px] px-[20px] h-full flex flex-col">{component}</div>
        )}
      </div>
    </div>
  )
}

export default App
