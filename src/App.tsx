import { ToastContainer } from 'react-toastify'
import useRouteElement from './useRouteElement'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const routeElemets = useRouteElement()
  return (
    <>
      {routeElemets}
      <ToastContainer />
    </>
  )
}

export default App
