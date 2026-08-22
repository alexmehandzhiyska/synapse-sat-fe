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
import TeacherGuard from './components/common/guards/TeacherGuard/TeacherGuard';
import AddPracticeTest from './components/PracticeTests/AddPracticeTest/AddPracticeTest';
import AddQuestion from './components/PracticeTests/AddQuestion/AddQuestion';
import ReviewQuestions from './components/PracticeTests/ReviewQuestions/ReviewQuestions';
import AdminGuard from './components/common/guards/AdminGuard/AdminGuard';
import AdminUsers from './components/Admin/AdminUsers/AdminUsers';
import Notebook from './components/Notebook/Notebook';

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
                <Route path="/practice-tests/add" element={<TeacherGuard><AddPracticeTest /></TeacherGuard>} />
                <Route path="/practice-tests/:testId" element={<StudentGuard><PracticeTest /></StudentGuard>} />
                <Route path="/practice-tests/:testId/questions/add" element={<TeacherGuard><AddQuestion /></TeacherGuard>} />
                <Route path="/practice-tests/:testId/review" element={<TeacherGuard><ReviewQuestions /></TeacherGuard>} />
                <Route path="/practice-tests/:testId/results/:attemptId" element={<StudentGuard><ScoreReport /></StudentGuard>}/>
                <Route path="/study-plan-setup" element={<StudentGuard><StudyPlanSetup /></StudentGuard>} />
                <Route path="/study-plan-edit" element={<StudentGuard><StudyPlanEditForm /></StudentGuard>} />
                <Route path="/admin/users" element={<AdminGuard><AdminUsers /></AdminGuard>} />
                <Route path="/notebook" element={<StudentGuard><Notebook /></StudentGuard>} />
            </Routes>
        </Layout>
    )
}

export default App;