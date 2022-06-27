import { Fragment, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';

/**************** SEMANTIC UI ****************/
import { Container } from 'semantic-ui-react';

/**************** REACT TOASTIFY ****************/
import { ToastContainer, toast } from 'react-toastify';
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
import SingleProfile from './pages/SingleProfile';
import Account from './pages/Account';
import WriteBlog from './pages/WriteBlog';
import SingleBlog from './pages/SingleBlog';
import EditBlog from './pages/EditBlog';
import Category from './pages/Category';
import Authors from './pages/Authors';
import EditAuthor from './pages/EditAuthor';
import Blogs from './pages/Blogs';

function App() {

  const { user } = useSelector(state => state.auth);

  // Logout If token expires
  useEffect(() => {
    try {
      const token = JSON.parse(localStorage.getItem('user')).token;
      const decodedToken = jwtDecode(token);
      let currentDate = new Date();
      // JWT exp is in seconds
      if (decodedToken.exp * 1000 > currentDate.getTime()) {
        setTimeout(() => {
          localStorage.removeItem('user');
          window.location.replace('/login');
          localStorage.setItem('showAutoLogoutToast', true);
        }, decodedToken.exp * 1000 - currentDate.getTime());
      }
      else {
        setTimeout(() => {
          localStorage.removeItem('user');
          window.location.replace('/login');
          localStorage.setItem('showAutoLogoutToast', true);
        }, 10);
      }
    }
    catch (err) { localStorage.removeItem('user'); }
  }, [user])

  // Show toast message when token expire
  useEffect(() => {
    if (localStorage.getItem("showAutoLogoutToast") === "true") {
      toast.error('Session Expired. Please Login again');
      localStorage.removeItem("showAutoLogoutToast");
    }
  }, [])

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
            <Route path='/profile/:profileId' element={<SingleProfile />} />
            <Route path='/account' element={<Account />} />
            <Route path='/write' element={<WriteBlog />} />
            <Route path='/blogs' element={<Blogs />} />
            <Route path='/edit' element={<EditBlog />} />
            <Route path='/blog/:blogId' element={<SingleBlog />} />
            <Route path='/category' element={<Category />} />
            <Route path='/authors' element={<Authors />} />
            <Route path='/edit/author' element={<EditAuthor />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
