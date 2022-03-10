import React, { Fragment, useEffect, useState } from 'react'
import { Button, Grid, Icon, Form } from 'semantic-ui-react'
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { authReset, forgotPassword } from '../features/auth/authSlice';
import { profileReset } from '../features/profile/profileSlice';

function ForgotPassword() {

    const [email, setEmail] = useState('');
    const onChange = (e) => {
        setEmail(e.target.value);
    }

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, errorMessage, successMessage } = useSelector(state => state.auth);

    useEffect(() => {
        if (user && user.token) {
            navigate('/');
        }
        else {
            dispatch(authReset());
            dispatch(profileReset());
        }

        if (isError) {
            errorMessage.map(msg => toast.error(msg));
        }

        if (isSuccess) {
            successMessage.map(msg => toast.success(msg));
        }

    }, [user, isError, isSuccess, navigate, dispatch])

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(email));
    }

    return (
        <Fragment>
            <Grid centered>
                <Grid.Row >
                    <Icon name='unlock' size='huge' />
                    <h1 style={{ marginLeft: 8, position: 'relative', bottom: '12px' }}>
                        Forgot Password
                    </h1>
                </Grid.Row>
            </Grid>
            <br />
            <div className="form-control">
                <Form onSubmit={onSubmit} className={isLoading ? 'loading' : ''}>
                    <Form.Field>
                        <label>Email</label>
                        <input
                            placeholder='Email'
                            name='email'
                            type='text'
                            value={email}
                            onChange={onChange}
                        />
                    </Form.Field>
                    <Button type='submit' color='teal'>Get New Password</Button>
                    <Button className='back-to-login' as={Link} to={'/login'} >
                        <Icon name='backward' />
                        Back to Login
                    </Button>
                </Form>
            </div>
        </Fragment>
    )
}

export default ForgotPassword