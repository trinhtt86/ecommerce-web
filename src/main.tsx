import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './stylesheet.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider } from './contexts/app.context'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import 'src/i18n/i18n'
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
})
const container = document.getElementById('root')

if (!container) {
  throw new Error('Root container missing in index.html')
}

const root = ReactDOM.createRoot(container)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </AppProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
)
