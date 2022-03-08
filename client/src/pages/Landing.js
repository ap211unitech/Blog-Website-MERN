import React, { Fragment, useEffect } from 'react'
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authReset } from '../features/auth/authSlice';
import { profileReset, getMyProfile } from '../features/profile/profileSlice';
import { Message } from 'semantic-ui-react'

function Landing() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { profile, isError, errorMessage } = useSelector(state => state.profile);

    useEffect(() => {

        if (isError) {
            errorMessage.map(msg => toast.error(msg));
            return;
        }

        if (user && user.token) {
            dispatch(getMyProfile());
        }
        else {
            dispatch(authReset());
            dispatch(profileReset());
        }

    }, [user, isError, navigate, dispatch])

    return (
        <Fragment>
            {user && user.token ?
                profile && !profile.isActivated ?
                    <Message info className='activation-message' >
                        <p>Your Account is not verified yet.
                            <span
                                style={{ textDecoration: 'underline', marginLeft: 6, cursor: 'pointer' }}
                            >
                                Click here to Verify Account
                            </span>
                        </p>
                    </Message> : null
                :
                <div>ee</div>
            }
        </Fragment>
    )
}

export default Landing