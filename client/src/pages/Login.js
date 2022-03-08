import React, { Fragment, useEffect, useState } from 'react';
import { Form, Button, Icon, Grid } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authReset, loginUserForm } from '../features/auth/authSlice';

function Login() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, errorMessage } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    useEffect(() => {

        if (user && user.token) {
            navigate('/');
        }
        else {
            dispatch(authReset());
        }

        if (isError) {
            errorMessage.map(msg => toast.error(msg));
            return;
        }

    }, [user, isError, isSuccess, navigate, dispatch])

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
        dispatch(loginUserForm(formData));
    }

    return (
        <Fragment>
            <Grid centered>
                <Grid.Row >
                    <Icon name='sign-in' size='huge' />
                    <h1 style={{ marginLeft: 8, position: 'relative', bottom: '12px' }}>
                        Login
                    </h1>
                </Grid.Row>
            </Grid>
            <h2 style={{ textAlign: 'center', color: 'gray' }}>
                Login and start writting blogs
            </h2>
            <div className="form-control">
                <Form onSubmit={onSubmit}>
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
                    <Button type='submit' color='teal'>Login</Button>
                </Form>
            </div>
        </Fragment>
    )
}

export default Login