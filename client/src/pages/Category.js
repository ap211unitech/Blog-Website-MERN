import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { Loader, Segment } from 'semantic-ui-react';
import { getAllCategory } from '../features/category/categorySlice';
import { getMyProfile } from '../features/profile/profileSlice';

function Category() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);
    const { categories, isLoading } = useSelector(state => state.category);

    useEffect(async () => {

        const res = await dispatch(getMyProfile());
        if (!user || !user.token || res.payload.role !== "admin") {
            navigate('/');
            return
        }

        dispatch(getAllCategory());

    }, [navigate, dispatch])

    if (isLoading) {
        return <Fragment>
            <Loader active content='Loading categories...' />
        </Fragment>
    }

    return (
        <Fragment>
            {categories?.map(cat =>
                <Segment>
                    {cat.name}
                </Segment>
            )}
        </Fragment>
    )
}

export default Category