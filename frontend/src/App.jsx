import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
      </Routes>
    </BrowserRouter>
  )
}

export default App
