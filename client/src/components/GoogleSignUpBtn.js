import React, { Fragment } from 'react';
import { GoogleLogin } from 'react-google-login';
import { Button } from 'semantic-ui-react';
import { GOOGLE_CLIENT_ID } from '../config/defaults';
import { googleSignInAuthentication } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify';

function GoogleSignUpBtn() {

    const dispatch = useDispatch();

    const onSuccessResponseGoogle = (response) => {
        const idToken = response.tokenId;
        dispatch(googleSignInAuthentication(idToken));
    }

    const onFailureResponseGoogle = (response) => {
        console.log(response)
        toast.error('Google Sign In unsuccessful.')
    }

    return (
        <Fragment>
            <section style={{
                marginTop: 12
            }} >
                <GoogleLogin
                    clientId={GOOGLE_CLIENT_ID}
                    render={renderProps => (
                        <Button onClick={renderProps.onClick} disabled={renderProps.disabled} color='teal' fluid>Sign Up with Google</Button>
                    )}
                    onSuccess={onSuccessResponseGoogle}
                    onFailure={onFailureResponseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
            </section>
        </Fragment>
    )
}

export default GoogleSignUpBtn