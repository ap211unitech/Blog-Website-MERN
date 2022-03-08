import React, { useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authReset, activateAccount } from '../features/auth/authSlice';
import { profileReset, getMyProfile } from '../features/profile/profileSlice';
import { Message } from 'semantic-ui-react'

function ActivateAccount() {

    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isError, isSuccess, errorMessage, successMessage } = useSelector(state => state.auth);
    const { profile } = useSelector(state => state.profile);

    useEffect(() => {
        dispatch(getMyProfile());
    }, [dispatch])

    useEffect(() => {
        if (profile && !profile.isActivated) {
            dispatch(activateAccount({ token }));
        }
        else if (profile && profile.isActivated) {
            toast.error('User account already activated');
        }

        if (isError) {
            errorMessage.map(msg => toast.error(msg));
            return;
        }

        if (isSuccess) {
            successMessage.map(msg => toast.success(msg));
            return;
        }

    }, [user, profile, isSuccess, navigate, dispatch])

    return (
        <Fragment>

        </Fragment>
    )
}

export default ActivateAccount