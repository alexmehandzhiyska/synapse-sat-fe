import { Route, Routes } from 'react-router-dom';
import './App.css';

import Layout from './components/common/Layout/Layout';
import Home from './components/Home/Home';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Profile from './components/Profile/Profile';
import AboutUs from './components/AboutUs/AboutUs';
import PracticeTestsList from './components/PracticeTests/PracticeTestsList';
import PracticeTest from './components/PracticeTests/PracticeTest/PracticeTest';
import ScoreReport from './components/PracticeTests/ScoreReport/ScoreReport';
import StudyPlanSetup from './components/StudyPlans/StudyPlanSetup/StudyPlanSetup';
import StudyPlanEditForm from './components/StudyPlans/StudyPlanEditForm/StudyPlanEditForm';
import StudentGuard from './components/common/guards/StudentGuard/StudentGuard';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/practice-tests" element={<PracticeTestsList />} />
                <Route path="/practice-tests/:testId" element={<StudentGuard><PracticeTest /></StudentGuard>} />
                <Route path="/practice-tests/:testId/results/:attemptId" element={<StudentGuard><ScoreReport /></StudentGuard>}/>
                <Route path="/study-plan-setup" element={<StudentGuard><StudyPlanSetup /></StudentGuard>} />
                <Route path="/study-plan-edit" element={<StudentGuard><StudyPlanEditForm /></StudentGuard>} />
            </Routes>
        </Layout>
    )
}

export default App;