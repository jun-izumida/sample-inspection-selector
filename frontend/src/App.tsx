import { ReactNode, useContext, useEffect, useState, useReducer } from 'react'
import './App.css'
import './loading.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Nav from './components/Nav'
import { Container } from '@mui/material'
import PickUp from './pages/Pickup/Index'
import Peel from './pages/Peel/Index'
import { AppContext, AppInitialState, AppReducer } from './store/app'

const AppProvider = ({ children }: { children?: ReactNode; }) => {
  const [ appState, appDispatch ] = useReducer(AppReducer, AppInitialState)
  return (
    <AppContext.Provider value={{appState, appDispatch}}>{children}</AppContext.Provider>
  )
}

const App = () => {

  return (
    <BrowserRouter basename="/">
      <AppProvider>
        <Nav />
        <Container sx={{ mt: 2}}>
        <Routes>
          <Route path={"/"} element={<div></div>} />
          <Route path={"/pickup"} element={<PickUp />} />
          <Route path={"/peel"} element={<Peel />} />
        </Routes>
        </Container>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
