import React, { Fragment, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { authReset } from '../features/auth/authSlice';
import { profileReset } from '../features/profile/profileSlice';
import { Grid, Icon, Form, Button } from 'semantic-ui-react';

function Account() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        if (!user || !user.token) {
            navigate('/');
            dispatch(authReset());
            dispatch(profileReset());
        }
    }, [dispatch, navigate])

    return (
        <Fragment>
            <Grid centered>
                <Grid.Row >
                    <Icon name='setting' size='huge' />
                    <h1 style={{ marginLeft: 8, position: 'relative', bottom: '12px' }}>
                        Your Account
                    </h1>
                </Grid.Row>
            </Grid>
            <h2 style={{ textAlign: 'center', color: 'gray' }}>
                Some Account Details are here
            </h2>
            <div className="form-control">
                <Form>
                    <Form.Field>
                        <label>Name</label>
                        <input
                            readOnly
                            type='text'
                            value={user.name}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Email</label>
                        <input
                            readOnly
                            type='text'
                            value={user.email}
                        />
                    </Form.Field>
                    <Button secondary fluid as={Link} to='/change-password'> Change Password </Button>
                </Form>
            </div>
        </Fragment>
    )
}

export default Account