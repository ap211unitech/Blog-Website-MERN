import React, { useEffect } from 'react'
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Landing() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    useEffect(() => {

        if (!user || !user.token) {
            navigate('/login');
        }

    }, [user, navigate, dispatch])
    return (
        <div>Landing</div>
    )
}

export default Landing