import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Grid, Icon } from 'semantic-ui-react';

const WriteBlog = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = useSelector(state => state.auth);

    useEffect(() => {

        if (auth.user && auth.user.token) {

        }
        else {
            navigate('/');
        }

    }, [auth, dispatch, navigate])


    return (
        <Fragment>
            <Grid centered>
                <Grid.Row >
                    <Icon name='edit' size='huge' />
                    <h1 style={{ marginLeft: 8, position: 'relative', bottom: '12px' }}>
                        Write a new blog
                    </h1>
                </Grid.Row>
            </Grid>
            <h2 style={{ textAlign: 'center', color: 'gray' }}>
                Create a new blog and share your knowledge
            </h2>

        </Fragment>
    )
}

export default WriteBlog