import Navigation from './Components/NavigationBar/Navigation'
import { Route, Router, Routes } from 'react-router-dom'
import DetailsPage from './Pages/DetailsPage/DetailsPage'
import HomePage from './Pages/HomePage/HomePage'
import ArtistsPage from './Pages/ArtistsPage/ArtistsPage'
import TracksPage from './Pages/TracksPage/TracksPage'

function App() {

  return (
    <div>
      <Navigation/>

      <Routes>
        <Route path='/' element={<HomePage/>}/>
        {/* <Route path ='/details' element={<DetailsPage/>}/> */}
        <Route path ='/artists/:id' element={<ArtistsPage/>}/>
        <Route path ='/tracks/:id' element={<TracksPage/>}/>
      </Routes>
    </div>
  )
}

export default App
