import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar/Navbar";
import MobileBottomNav from "./components/MobileBottomNav/MobileBottomNav";
import Footer from "./components/Footer/Footer";
import LevelUpModal from "./components/LevelUpModal/LevelUpModal";
import XpToast from "./components/XpToast/XpToast";
import OnboardingModal from "./components/OnboardingModal/OnboardingModal";
import AuthModal from "./components/AuthModal/AuthModal";
import FeedbackModal from "./components/FeedbackModal/FeedbackModal";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { initClientErrorMonitoring } from "./services/errorMonitoring";
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
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy";
import TermsOfUse from "./pages/Legal/TermsOfUse";

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
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}

export default function App() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    initClientErrorMonitoring();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProgressProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Navbar />
            <AnimatedRoutes />
            <MobileBottomNav />
            <Footer onOpenFeedback={() => setFeedbackOpen(true)} />
            <LevelUpModal />
            <XpToast />
            <OnboardingModal />
            <AuthModal />
            <FeedbackModal
              isOpen={feedbackOpen}
              onClose={() => setFeedbackOpen(false)}
            />
          </BrowserRouter>
        </ProgressProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}