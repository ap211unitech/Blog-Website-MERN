import React, { Fragment, useEffect } from 'react'
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { authReset, sendActivationMail } from '../features/auth/authSlice';
import { profileReset, getMyProfile } from '../features/profile/profileSlice';
import { Grid, Message, Icon, Label } from 'semantic-ui-react'
import { blogReset, getLatestBlogs } from '../features/blog/blogSlice';

function Landing() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isSuccess, successMessage } = useSelector(state => state.auth);
    const { profile, isError, errorMessage } = useSelector(state => state.profile);
    const blog = useSelector(state => state.blog);

    useEffect(() => {

        dispatch(getLatestBlogs());

        if (user && user.token) {
            dispatch(getMyProfile());
        }
        else {
            dispatch(authReset());
            dispatch(profileReset());
            dispatch(blogReset());
        }

        if (isError) {
            errorMessage.map(msg => toast.error(msg));
            return;
        }

        if (isSuccess) {
            successMessage.map(msg => toast.success(msg));
            return;
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
                    profile && profile.isActivated ?
                        <Message success className='activation-message' >
                            <p>Your Account is verified.</p>
                        </Message> : null
                :
                <div></div>
            }

            {/* <h1>Latest Blogs</h1> */}
            <Grid>
                {blog.latestBlogs ?
                    blog.latestBlogs.map(blog => (
                        <Grid.Row key={blog._id} >
                            <Grid.Column width={13} verticalAlign='middle' >
                                <div className='latestBlogAuthor'>
                                    <Link to={`/profile/${blog.profile._id}`} >
                                        <img style={{ borderRadius: '50%', margin: 'auto 6px -11px auto' }} src={blog.profile.profileUrl} width={35} height={35} alt="Profile Image" />
                                        {' '}  {blog.user.name}
                                    </Link>
                                    <span style={{ color: 'grey', marginLeft: 5 }}>
                                        Last updated on {new Date(blog.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h2 style={{ margin: '20px 0px 0px 0px', padding: 0 }} > {blog.title}</h2>
                                <p style={{ fontSize: 16, paddingTop: 5 }} >
                                    {blog.desc.substr(0, 160)}...........
                                    <Link to={`/blog/${blog._id}`}>Read more</Link>
                                </p>
                                <Label >{blog.category.name}</Label>
                                <div className='latestBlogLDC' >
                                    <p>
                                        <Icon name='eye' />
                                        {blog.viewedBy.length}
                                    </p>
                                    <p>
                                        <Icon name='thumbs up' />
                                        {blog.likes.length}
                                    </p>
                                    <p>
                                        <Icon name='thumbs down' />
                                        {blog.dislikes.length}
                                    </p>
                                    <p>
                                        <Icon name='comments' />
                                        {blog.comments.length}
                                    </p>
                                </div>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <img height={'70%'} alt='Blog Image' src={blog.coverPhoto} />
                            </Grid.Column>
                        </Grid.Row>
                    ))
                    : null

                }
            </Grid>

        </Fragment>
    )
}

export default Landing