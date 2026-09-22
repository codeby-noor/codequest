import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import LevelUpModal from "./components/LevelUpModal/LevelUpModal";
import XpToast from "./components/XpToast/XpToast";
import OnboardingModal from "./components/OnboardingModal/OnboardingModal";
import AuthModal from "./components/AuthModal/AuthModal";
import { AuthProvider } from "./context/AuthContext";
import { ProgressProvider } from "./context/ProgressContext";
import Home from "./pages/Home/Home";
import Learn from "./pages/Learn/Learn";
import Lesson from "./pages/Lesson/Lesson";
import Worlds from "./pages/Worlds/Worlds";
import SkillTreePage from "./pages/SkillTree/SkillTree";
import Challenges from "./pages/Challenges/Challenges";
import Projects from "./pages/Projects/Projects";
import ProjectDetail from "./pages/Projects/ProjectDetail";
import Profile from "./pages/Profile/Profile";
import CodeArenaPage from "./pages/CodeArena/CodeArenaPage";
import ArenaSelection from "./pages/CodeArena/ArenaSelection";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import Achievements from "./pages/Achievements/Achievements";
import Mentor from "./pages/Mentor/Mentor";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  duration: 0.35,
  ease: [0.4, 0, 0.2, 1],
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:worldId" element={<Learn />} />
          <Route path="/learn/:worldId/:lessonId" element={<Lesson />} />
          <Route path="/worlds" element={<Worlds />} />
          <Route path="/skill-tree" element={<SkillTreePage />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/code-arena" element={<ArenaSelection />} />
          <Route path="/code-arena/:challengeId" element={<CodeArenaPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/mentor" element={<Mentor />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Navbar />
          <AnimatedRoutes />
          <Footer />
          <LevelUpModal />
          <XpToast />
          <OnboardingModal />
          <AuthModal />
        </BrowserRouter>
      </ProgressProvider>
    </AuthProvider>
  );
}