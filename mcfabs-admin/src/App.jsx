import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import { RequireAuth, RedirectIfAuthed } from './components/AuthGuard'
import DashboardLayout from './components/DashboardLayout'
import Login from './pages/Login'
import GalleryManager from './pages/GalleryManager'
import AnnouncementsManager from './pages/AnnouncementsManager'
import BlogEditor from './pages/BlogEditor'
import MasterclassEditionsManager from './pages/MasterclassEditionsManager'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <RedirectIfAuthed>
              <Login />
            </RedirectIfAuthed>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="gallery" replace />} />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="announcements" element={<AnnouncementsManager />} />
          <Route path="blog" element={<BlogEditor />} />
          <Route path="masterclass" element={<MasterclassEditionsManager />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
