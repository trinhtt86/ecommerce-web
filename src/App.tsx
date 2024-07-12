import { useContext, useEffect } from 'react'
import useRouteElements from './useRouteElements'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { localStorageEventTarget } from './utils/auth'
import { AppContext } from './contexts/app.context'
import { HelmetProvider } from 'react-helmet-async'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
function App() {
  const routeElements = useRouteElements()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    localStorageEventTarget.addEventListener('clearLS', reset)
    return () => {
      localStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])
  return (
    <HelmetProvider>
      <ErrorBoundary>
        {routeElements}
        <ToastContainer />
      </ErrorBoundary>
    </HelmetProvider>
  )
}

export default App
