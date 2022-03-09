import React, { useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { activateAccount } from '../features/auth/authSlice';
import { getMyProfile } from '../features/profile/profileSlice';
import { Message } from 'semantic-ui-react'

function ActivateAccount() {

    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isError, errorMessage, successMessage } = useSelector(state => state.auth);

    useEffect(() => {

        if (user && user.token) {
            dispatch(getMyProfile());
            dispatch(activateAccount({ token }));
        }
        else {
            navigate('/');
        }

    }, [user, navigate, dispatch])

    return (
        <Fragment>
            {successMessage.map(msg =>
                <Message success>
                    {msg}
                </Message>
            )}
            {isError && errorMessage.map(msg =>
                <Message error>
                    {msg}
                </Message>
            )}
        </Fragment>
    )
}

export default ActivateAccount