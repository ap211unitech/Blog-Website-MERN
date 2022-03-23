import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, Grid, Icon } from 'semantic-ui-react';
import { toast } from "react-toastify";
import { authReset, changePassword } from "../features/auth/authSlice"
import { profileReset } from '../features/profile/profileSlice';

function ChangePassword() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, errorMessage, successMessage } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const onSubmit = () => {
        if (formData.newPassword !== formData.confirmNewPassword) {
            toast.error('New Passwords do not match');
            return;
        }
        if (formData.newPassword < 6) {
            toast.error('New Password must be length of greater than 6');
            return;
        }
        dispatch(changePassword(formData));
    }

    useEffect(() => {
        if (!user) {
            navigate('/');
            dispatch(authReset());
            dispatch(profileReset());
        }
        else {
            if (isError) {
                errorMessage.map(err => toast.error(err));
            }
            if (isSuccess) {
                successMessage.map(msg => toast.success(msg));
            }
            dispatch(authReset());
        }
    }, [isError, isSuccess, navigate, dispatch])

    return (
        <Fragment>
            <Grid centered>
                <Grid.Row >
                    <Icon name='edit' size='huge' />
                    <h1 style={{ marginLeft: 8, position: 'relative', bottom: '12px' }}>
                        Change Password
                    </h1>
                </Grid.Row>
            </Grid>
            <h2 style={{ textAlign: 'center', color: 'gray' }}>
                Change your password here
            </h2>
            <div className="form-control">
                <Form onSubmit={onSubmit} className={isLoading ? 'loading' : ''}>
                    <Form.Field>
                        <label>Old Password</label>
                        <input
                            placeholder='Old Password'
                            name='oldPassword'
                            type='password'
                            value={formData.oldPassword}
                            onChange={onChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>New Password</label>
                        <input
                            placeholder='New Password'
                            name='newPassword'
                            type='password'
                            value={formData.newPassword}
                            onChange={onChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Confirm New Password</label>
                        <input
                            placeholder='Confirm Password'
                            name='confirmNewPassword'
                            type='password'
                            value={formData.confirmNewPassword}
                            onChange={onChange}
                        />
                    </Form.Field>
                    <Button type='submit' color='teal'>Change Password</Button>
                </Form>
            </div>
        </Fragment>
    )
}

export default ChangePassword