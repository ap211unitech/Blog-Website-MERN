import React, { Fragment, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { authReset } from '../features/auth/authSlice';
import { profileReset } from '../features/profile/profileSlice';
import { Grid, Icon, Form, Button } from 'semantic-ui-react';


const formatDate = (iso) => {
    let date = new Date(iso);
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    date = dd + '/' + mm + '/' + yyyy;

    let time = new Date(iso).toLocaleTimeString();

    return date + " , " + time;
}

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
            {user ?
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
                            <Form.Field>
                                <label>Account Created at</label>
                                <input
                                    readOnly
                                    type='text'
                                    value={formatDate(user.createdAt)}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Last Updated at</label>
                                <input
                                    readOnly
                                    type='text'
                                    value={formatDate(user.updatedAt)}
                                />
                            </Form.Field>
                            <Button secondary fluid as={Link} to='/change-password'> Change Password </Button>
                        </Form>
                    </div>
                </Fragment>
                : null
            }
        </Fragment>
    )
}

export default Account