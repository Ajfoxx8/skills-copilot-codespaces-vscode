import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from './Layout.js';
import Upload from './pages/Upload.js';
import Results from './pages/Results.js';
import Library from './pages/Library.js';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/upload" replace />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/results/:songId" element={<Results />} />
        <Route path="/library" element={<Library />} />
        <Route path="*" element={<Navigate to="/upload" replace />} />
      </Routes>
    </Layout>
  );
}
