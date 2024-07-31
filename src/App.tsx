import { ToastContainer } from 'react-toastify'
import useRouteElement from './useRouteElement'
import 'react-toastify/dist/ReactToastify.css'
import { useContext, useEffect } from 'react'
import { LocalStorageEventTarger } from './utils/auth'
import { AppContext } from './contexts/app.context'

function App() {
  const routeElemets = useRouteElement()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    LocalStorageEventTarger.addEventListener('clearLS', reset)
    return () => {
      LocalStorageEventTarger.removeEventListener('clearLS', reset)
    }
  }, [reset])
  return (
    <>
      {routeElemets}
      <ToastContainer />
    </>
  )
}

export default App
