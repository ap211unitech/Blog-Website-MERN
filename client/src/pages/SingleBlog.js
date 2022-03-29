import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Grid, Image, Loader, Message, Icon, Container, Label, Form, Button } from 'semantic-ui-react';
import { dislikeBlogByBlogID, getBlogByBlogID, likeBlogByBlogID } from '../features/blog/blogSlice';

function SingleBlog() {

    const { blogId } = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { singleBlog, isLoading, isError, errorMessage } = useSelector(state => state.blog)
    const auth = useSelector(state => state.auth);

    const likeBlog = async () => {
        if (auth.user && auth.user.token) {
            dispatch(likeBlogByBlogID(blogId));
        }
        else {
            toast.error('Please login to like the blog');
        }
    }

    const dislikeBlog = async () => {
        if (auth.user && auth.user.token) {
            dispatch(dislikeBlogByBlogID(blogId));
        }
        else {
            toast.error('Please login to like the blog');
        }
    }

    useEffect(() => {

        dispatch(getBlogByBlogID(blogId));

    }, [navigate, dispatch])

    return (
        <Fragment>
            {/* {isError && !isLoading ?
                <Fragment>
                    {errorMessage.map(err => (<Message error floating content={err} />))}
                </Fragment> : null
            } */}
            {
                isLoading ? <Loader active>Loading Blog</Loader>
                    :
                    !singleBlog ? <Message error floating content={'No such blog found'} />
                        :
                        <Fragment>
                            <Container text>

                                <div className='single-blog-author' >
                                    <div className="author-logo">

                                        <Link to={`/profile/${singleBlog.profile._id}`} >
                                            <img width={60} height={60} style={{ borderRadius: '50%' }} src={singleBlog.profile.profileUrl} alt="Profile" />
                                        </Link>
                                    </div>
                                    <div className="author-data">
                                        <Link to={`/profile/${singleBlog.profile._id}`}>
                                            <h3>{singleBlog.user.name}</h3>
                                        </Link>
                                        <div>
                                            <p style={{ color: 'grey' }}>
                                                Last updated on  {new Date(singleBlog.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>




                                <Label>{singleBlog.category.name}</Label>

                                <div className='single-blog-header' >
                                    <h1>{singleBlog.title}</h1>
                                    <img src={singleBlog.coverPhoto} alt="Blog Cover Photo" />
                                    <p style={{ fontSize: 16 }}>{singleBlog.desc}</p>
                                </div>
                                <div className="single-blog-content">
                                    {singleBlog.content.map(content => (
                                        <Fragment key={content._id}>
                                            <img src={content.image} alt="Photo" />
                                            <p style={{ fontWeight: 'bold' }}>{content.desc.substr(0, 8)} <span style={{ fontWeight: 'normal', marginLeft: -2 }} >{content.desc.substr(8)}</span> </p>
                                        </Fragment>
                                    ))}
                                </div>

                                <br />
                                <div className="single-blog-vldc">
                                    <p>
                                        <Icon name='eye' />
                                        {singleBlog.viewedBy.length}
                                    </p>
                                    <p onClick={likeBlog} >
                                        <Icon name='thumbs up' />
                                        {singleBlog.likes.length}
                                    </p>
                                    <p onClick={dislikeBlog} >
                                        <Icon name='thumbs down' />
                                        {singleBlog.dislikes.length}
                                    </p>
                                </div>

                                {/* Comments Section */}
                                <h2>Write a comment....</h2>
                                <Form>
                                    <Form.Field>
                                        <input placeholder='Write your comment here' />
                                    </Form.Field>
                                    <Button type='submit' secondary>Post comment</Button>
                                </Form>
                                <br />
                            </Container>
                        </Fragment>
            }
        </Fragment>
    )
}

export default SingleBlog