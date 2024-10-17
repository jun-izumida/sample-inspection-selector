import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Nav from './components/Nav'
import { Container } from '@mui/material'
import PickUp from './pages/Pickup/Index'
import Peel from './pages/Peel/Index'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter basename="/">
      <Nav />
      <Container sx={{ mt: 2}}>
      <Routes>
        <Route path={"/"} element={<div>a</div>} />
        <Route path={"/pickup"} element={<PickUp />} />
        <Route path={"/peel"} element={<Peel />} />
      </Routes>
      </Container>
    </BrowserRouter>
  )
}

export default App
