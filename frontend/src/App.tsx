import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentJoin from './pages/StudentJoin';
import TopicSelection from './pages/TopicSelection';
import StudentWaiting from './pages/StudentWaiting';
import QuizEngine from './pages/QuizEngine';
import StudentResult from './pages/StudentResult';
import CoachDashboard from './pages/CoachDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Student Routes */}
        <Route path="/" element={<StudentJoin />} />
        <Route path="/room/:roomId/topics" element={<TopicSelection />} />
        <Route path="/room/:roomId/waiting" element={<StudentWaiting />} />
        <Route path="/room/:roomId/quiz/:topicId" element={<QuizEngine />} />
        <Route path="/room/:roomId/result" element={<StudentResult />} />
        
        {/* Coach Routes */}
        <Route path="/coach/dashboard" element={<CoachDashboard />} />
        
        {/* Fallback */}
        <Route path="*" element={<StudentJoin />} />
      </Routes>
    </Router>
  );
};

export default App;
