import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Grid } from 'semantic-ui-react';
import BlogItem from '../components/BlogItem';
import { getBlogsOfUser } from '../features/blog/blogSlice';

function Blogs() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = useSelector(state => state.auth);
    const { blogsOfUser } = useSelector(state => state.blog);
    console.log(blogsOfUser)

    useEffect(async () => {
        if (!auth || !auth.user || !auth.user.token) {
            navigate('/');
            return
        }
        // Get all blogs of current user
        dispatch(getBlogsOfUser({ userId: auth.user._id }));
    }, [auth, dispatch, navigate])

    return (
        <Fragment>
            <div className="user-blogs">
                <Fragment>
                    {/* <Message floating header={`Blogs by ${otherProfile.user.name.split(' ')[0]}`} /> */}
                    <Grid>
                        {blogsOfUser && blogsOfUser.map(blog => <BlogItem blog={blog} />)}
                    </Grid>
                </Fragment>

            </div>
        </Fragment>
    )
}

export default Blogs