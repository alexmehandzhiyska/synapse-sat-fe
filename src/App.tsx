import { Route, Routes } from 'react-router-dom'
import './App.css';

import Layout from './components/common/Layout/Layout'
import Home from './components/Home/Home'
import Register from './components/Register/Register'

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Layout>
    )
}

export default App
