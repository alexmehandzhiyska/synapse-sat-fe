import { Route, Routes } from 'react-router-dom';
import './App.css';

import Layout from './components/common/Layout/Layout';
import Home from './components/Home/Home';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import AboutUs from './components/AboutUs/AboutUs';
import PracticeTestsList from './components/PracticeTests/PracticeTestsList';
import PracticeTest from './components/PracticeTests/PracticeTest/PracticeTest';
import ScoreReport from './components/PracticeTests/ScoreReport/ScoreReport';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/practice-tests" element={<PracticeTestsList />} />
                <Route path="/practice-tests/:testId" element={<PracticeTest />} />
                <Route path="/practice-tests/:testId/results/:attemptId" element={<ScoreReport />}/>
            </Routes>
        </Layout>
    )
}

export default App;