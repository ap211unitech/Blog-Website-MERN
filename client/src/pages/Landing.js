import React, { Fragment, useEffect } from 'react'
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authReset, sendActivationMail } from '../features/auth/authSlice';
import { profileReset, getMyProfile } from '../features/profile/profileSlice';
import { Message } from 'semantic-ui-react'

function Landing() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isSuccess, successMessage } = useSelector(state => state.auth);
    const { profile, isError, errorMessage } = useSelector(state => state.profile);

    useEffect(() => {

        if (isError) {
            errorMessage.map(msg => toast.error(msg));
            return;
        }

        if (isSuccess) {
            successMessage.map(msg => toast.success(msg));
            return;
        }

        if (user && user.token) {
            dispatch(getMyProfile());
        }
        else {
            dispatch(authReset());
            dispatch(profileReset());
        }

    }, [user, isError, isSuccess, navigate, dispatch])

    const sendActivationMailAgain = () => {
        dispatch(sendActivationMail());
    }

    return (
        <Fragment>
            {user && user.token ?
                profile && !profile.isActivated ?
                    <Message info className='activation-message' >
                        <p>Your Account is not verified yet.
                            <span
                                style={{ textDecoration: 'underline', marginLeft: 6, cursor: 'pointer' }}
                                onClick={sendActivationMailAgain}
                            >
                                Click here to Verify Account
                            </span>
                        </p>
                    </Message> :
                    <Message success className='activation-message' >
                        <p>Your Account is verified.</p>
                    </Message>
                :
                <div>ee</div>
            }
        </Fragment>
    )
}

export default Landing