
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import University from './pages/University';
import UserManagement from './pages/UserManagement';
import StudentManagement from './pages/StudentManagement';
import EventsPage from './pages/Events';
import MeetingsPage from './pages/Meetings';
import JobsPage from './pages/Jobs';

function App() {
  return (
    <Router>
      <Routes>
  {/* ...other routes... */}
  <Route path="/news-notices" element={<University />} />
  <Route path="/newsletter" element={<University />} />
  <Route path="/university" element={<University />} />
  <Route path="/user-management" element={<UserManagement />} />
  <Route path="/student-management" element={<StudentManagement />} />
  <Route path="/event" element={<EventsPage />} />
  <Route path="/meeting" element={<MeetingsPage />} />
  <Route path="/jobs" element={<JobsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
