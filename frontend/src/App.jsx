import { useState } from 'react'
import './App.css'
import Home from './components/Home'
import Sidebar from './components/SideMenu'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="flex h-screen antialiased bg-gray-50">
      <Sidebar />
      <Home />
    </div>
    </>
  )
}

export default App
