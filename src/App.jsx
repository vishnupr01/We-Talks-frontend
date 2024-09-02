
import './App.css'
import UserRoutes from './Routes/UserRoutes'
import './index.css'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Home from './Components/Admin/Home'
import AdminRoutes from './Routes/AdminRoutes'
import Form from './pages/User/GoogeForm'

function App() {
  
  return (
<>  
<AdminRoutes/> 
<UserRoutes/>

{/* dsfds */}


</>
  )
}

export default App
