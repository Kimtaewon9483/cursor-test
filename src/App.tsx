import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import GalleryPage from "./pages/GalleryPage";
import CalendarPage from "./pages/CalendarPage";
import StoriesPage from "./pages/StoriesPage";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./components/Login";
import MyPage from "./pages/MyPage";
import GroupDetailPage from "./pages/GroupDetailPage";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/stories" element={<StoriesPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/group/:groupId" element={<GroupDetailPage />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
