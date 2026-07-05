import { Route, Routes } from 'react-router-dom'
import './App.css';

import Layout from './components/common/Layout/Layout'
import Home from './components/Home/Home'

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </Layout>
    )
}

export default App
