import { Dashborad } from "./pages/Dashborad"
import { SignIn } from "./pages/SignIn"
import { SignUp } from "./pages/SignUp"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ErrorProvider, useErrorHandler } from './hooks/useErrorHandler'
import { ToastContainer } from './components/Toast'

function AppContent() {
  const { errors, removeError } = useErrorHandler();
  
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<Dashborad />} />
        </Routes>
      </BrowserRouter>
      
      {/* Toast notifications */}
      <ToastContainer errors={errors} onClose={removeError} />
    </div>
  )
}

function App() {
  return (
    <ErrorProvider>
      <AppContent />
    </ErrorProvider>
  )
}

export default App
