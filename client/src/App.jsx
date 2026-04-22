import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AnimalsPage from './pages/AnimalsPage'
import AnimalDetailPage from './pages/AnimalDetailPage'
import FindingNewBeginningsPage from './pages/FindingNewBeginningsPage'
import SuccessStoriesPage from './pages/SuccessStoriesPage'
import AdoptionFormPage from './pages/AdoptionFormPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/animals" element={<AnimalsPage />} />
        <Route path="/animals/:id" element={<AnimalDetailPage />} />
        <Route path="/finding-new-beginnings" element={<FindingNewBeginningsPage />} />
        <Route path="/success-stories" element={<SuccessStoriesPage />} />
        <Route path="/adoption-form" element={<AdoptionFormPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App