import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Aivle from './Screens/Aivle';
import LoginPage from './Screens/LoginPage';
import MainPage from './Screens/MainPage';
import Register from './Screens/Register';
import ResetPassword from './Screens/ResetPassword';
import SendEmail from './Screens/SendEmail';

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/main' element={<MainPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/video' element={<Aivle />} />
                <Route path='/register' element={<Register />} />
                <Route path='/send_email' element={<SendEmail />} />
                <Route path='/reset_password' element={<ResetPassword />} />
            </Routes>
        </Router>
    );
}

export default App;
