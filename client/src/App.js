import { Fragment } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

/**************** SEMANTIC UI ****************/
import { Container } from 'semantic-ui-react';

/**************** REACT TOASTIFY ****************/
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**************** PAGES ****************/
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import ResetPassword from './pages/ResetPassword';
import ActivateAccount from './pages/ActivateAccount';
import UpdateProfile from './pages/UpdateProfile';
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
    <Fragment>
      <ToastContainer autoClose={2500} />
      <BrowserRouter>
        <Container>
          <Navbar />
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/forgotpassword' element={<ForgotPassword />} />
            <Route path='/auth/resetpassword/:token' element={<ResetPassword />} />
            <Route path='/auth/activate/:token' element={<ActivateAccount />} />
            <Route path='/update-profile' element={<UpdateProfile />} />
            <Route path='/change-password' element={<ChangePassword />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
