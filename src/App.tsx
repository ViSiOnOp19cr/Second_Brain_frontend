import { Dashborad } from "./pages/Dashborad"
import { SignIn } from "./pages/SignIn"
import { SignUp } from "./pages/SignUp"
import { BrowserRouter,Routes,Route } from "react-router-dom"
function App() {


  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/signin" element={<SignIn/>}/>
          <Route path="/" element={<Dashborad/>}/>
        </Routes>
      </BrowserRouter>
      
    </div>
  )
}

export default App
