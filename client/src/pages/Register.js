import React, { Fragment, useEffect, useState } from 'react';
import { Form, Button, Icon, Grid } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUserForm, authReset } from '../features/auth/authSlice';
import { profileReset } from '../features/profile/profileSlice';
import GoogleSignUpBtn from '../components/GoogleSignUpBtn';

function Register() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, errorMessage } = useSelector(state => state.auth);

    useEffect(() => {

        if (user || isSuccess) {
            navigate('/');
        }
        else {
            dispatch(authReset());
            dispatch(profileReset());
        }

        if (isError) {
            errorMessage.map(msg => toast.error(msg));
            return;
        }


    }, [user, isError, isSuccess, navigate, dispatch])

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const onChange = (e) => {
        setFormData(prevState => (
            {
                ...prevState,
                [e.target.name]: e.target.value
            }
        )
        )
    }

    const onSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Password do not match');
            return;
        }

        dispatch(registerUserForm(formData));
    }

    return (
        <Fragment>
            <Grid centered>
                <Grid.Row>
                    <Icon name='user' size='huge' />
                    <h1 style={{ marginLeft: 8 }}>
                        Register
                    </h1>
                </Grid.Row>
            </Grid>
            <h2 style={{ textAlign: 'center', color: 'gray' }}>
                Please create an account
            </h2>
            <div className="form-control">
                <Form onSubmit={onSubmit} className={isLoading ? 'loading' : ''} >
                    <Form.Field>
                        <label>Name</label>
                        <input
                            placeholder='Name'
                            name='name'
                            type='text'
                            value={formData.name}
                            onChange={onChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Email</label>
                        <input
                            placeholder='Email'
                            name='email'
                            type='text'
                            value={formData.email}
                            onChange={onChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Password</label>
                        <input
                            placeholder='Password'
                            name='password'
                            type='password'
                            value={formData.password}
                            onChange={onChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Confirm Password</label>
                        <input
                            placeholder='Confirm Password'
                            name='confirmPassword'
                            type='password'
                            value={formData.confirmPassword}
                            onChange={onChange}
                        />
                    </Form.Field>
                    <Button type='submit' color='teal'>Register</Button>
                </Form>
                <div style={{
                    marginTop: 10
                }} >
                    <h5>Already have an account ?{' '}
                        <Link to={'/login'}>Sign In</Link>
                    </h5>
                </div>
                <hr className='signup' />
                <GoogleSignUpBtn />
            </div>
        </Fragment>
    )
}

export default Register