import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import AnimalsPage from './pages/AnimalsPage'
import AnimalDetailPage from './pages/AnimalDetailPage'
import FindingNewBeginningsPage from './pages/FindingNewBeginningsPage'
import SuccessStoriesPage from './pages/SuccessStoriesPage'
import AdoptionFormPage from './pages/AdoptionFormPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0d0d0d] text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/animals" element={<AnimalsPage />} />
          <Route path="/animals/:id" element={<AnimalDetailPage />} />
          <Route path="/finding-new-beginnings" element={<FindingNewBeginningsPage />} />
          <Route path="/success-stories" element={<SuccessStoriesPage />} />
          <Route path="/adoption-form" element={<AdoptionFormPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App