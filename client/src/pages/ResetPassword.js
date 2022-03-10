import React, { Fragment, useEffect, useState } from 'react'
import { Button, Grid, Icon, Form } from 'semantic-ui-react'
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { authReset, resetPassword } from '../features/auth/authSlice';
import { profileReset } from '../features/profile/profileSlice';

function ResetPassword() {

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    const onChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }


    const { token } = useParams();
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

        if (formData.password !== formData.confirmPassword) {
            toast.error('Password do not match');
            return;
        }
        else {
            dispatch(resetPassword({ newPassword: formData.password, token }));
        }
    }


    return (
        <Fragment>
            <Grid centered>
                <Grid.Row >
                    <Icon name='key' size='huge' />
                    <h1 style={{ marginLeft: 8, position: 'relative', bottom: '12px' }}>
                        Reset Password
                    </h1>
                </Grid.Row>
            </Grid>
            <br />
            <div className="form-control">
                <Form onSubmit={onSubmit} className={isLoading ? 'loading' : ''}>
                    <Form.Field>
                        <label>Create new password</label>
                        <input
                            placeholder='Password'
                            name='password'
                            type='password'
                            value={formData.password}
                            onChange={onChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Confirm new password</label>
                        <input
                            placeholder='Confirm Password'
                            name='confirmPassword'
                            type='password'
                            value={formData.confirmPassword}
                            onChange={onChange}
                        />
                    </Form.Field>
                    <Button type='submit' color='teal'>Reset Password</Button>
                    <Button className='back-to-login' as={Link} to={'/login'} >
                        <Icon name='backward' />
                        Back to Login
                    </Button>
                </Form>
            </div>
        </Fragment>
    )
}

export default ResetPassword