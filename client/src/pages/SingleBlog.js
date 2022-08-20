import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Loader, Message, Icon, Label, Form, Button } from 'semantic-ui-react';
import { formatDate } from '../app/helpers';
import { commentBlogByBlogID, deleteBlog, deleteCommentBlogByBlogID, dislikeBlogByBlogID, getBlogByBlogID, likeBlogByBlogID } from '../features/blog/blogSlice';

const checkIfKeyExists = (arr, loggedInUserId) => {
    return (arr.filter(elm => elm.user.toString() === loggedInUserId)).length == 0
}

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
            toast.error('Please login to dislike the blog');
        }
    }

    const [commentText, setCommentText] = useState('');
    const commentOnSubmit = async () => {
        if (commentText.trim().length === 0) {
            toast.error('Comment text should not be empty');
            return
        }
        else {
            const res = await dispatch(commentBlogByBlogID({ blogId, text: commentText }));
            if (res.type === '/blog/comment/fulfilled') {
                toast.success('Comment Posted');
                setCommentText('');
            }
        }
    }

    const handleCommentDelete = async (commentId) => {
        const res = await dispatch(deleteCommentBlogByBlogID({ blogId, commentId }))
        if (res.type === '/blog/comment/delete/rejected') {
            toast.error(res.payload);
            return;
        }
    }

    const handleDeleteBlog = async () => {
        if (window.confirm('Do you surely want to delete your blog?')) {
            const res = await dispatch(deleteBlog({ id: blogId }));
            if (res.type === '/blog/delete/rejected') {
                toast.error(res.payload);
                return;
            }
            else if (res.type === '/blog/delete/fulfilled') {
                toast.success('Blog deleted successfully')
                navigate('/');
            }
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

                            <div style={{ maxWidth: '75%', margin: 'auto' }}>

                                {auth?.user?.token && auth.user._id === singleBlog.user._id ?
                                    <div style={{ display: 'flex', margin: '8px auto 13px auto' }}>
                                        <div style={{}}>
                                            <Button secondary type='button' as={Link} to={`/edit`} state={{ blog: singleBlog }} >
                                                Edit Blog
                                            </Button>
                                        </div>

                                        <div style={{ marginLeft: 10 }}>
                                            <Button color='red' basic type='button' onClick={handleDeleteBlog} >
                                                Delete Blog
                                            </Button>
                                        </div>
                                    </div>
                                    : null
                                }

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
                                                Last updated on  {formatDate(singleBlog.updatedAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>



                                <div style={{ marginTop: 10 }}>
                                    <Label>{singleBlog.category.name}</Label>
                                </div>

                                <div className='single-blog-header'>
                                    <h1>{singleBlog.title}</h1>
                                    <img src={singleBlog.coverPhoto} alt="Blog Cover Photo" />
                                    <br />
                                    <div>
                                        <div className='single-blog-desc' dangerouslySetInnerHTML={{ __html: singleBlog.desc }}></div>
                                    </div>
                                </div>

                                {/* No use of this section now */}
                                {/* <div className="single-blog-content">
                                    {singleBlog.content.map(content => (
                                        <Fragment key={content._id}>
                                            <img src={content.image} alt="Photo" />
                                            <p style={{ fontWeight: 'bold' }}>{content.desc.substr(0, 8)} <span style={{ fontWeight: 'normal', marginLeft: -2 }} >{content.desc.substr(8)}</span> </p>
                                        </Fragment>
                                    ))}
                                </div> */}

                                <br />
                                <div className="single-blog-vldc">
                                    <p>
                                        <Icon name='eye' />
                                        {singleBlog.viewedBy.length} people viewed this blog
                                    </p>
                                    <p onClick={likeBlog} >
                                        {checkIfKeyExists(singleBlog.likes, auth?.user?._id) ?
                                            <Icon name='thumbs up outline' /> :
                                            <Icon name='thumbs up' />
                                        }
                                        {singleBlog.likes.length}
                                    </p>
                                    <p onClick={dislikeBlog} >
                                        {checkIfKeyExists(singleBlog.dislikes, auth?.user?._id) ?
                                            <Icon name='thumbs down outline' /> :
                                            <Icon name='thumbs down' />
                                        }
                                        {singleBlog.dislikes.length}
                                    </p>
                                    <p>
                                        <Icon name='comments' />
                                        {singleBlog.comments.length}
                                    </p>
                                </div>

                                {/* Total Comments */}
                                <h2>Comments</h2>

                                {singleBlog.comments.length ?
                                    singleBlog.comments.map(comment => (
                                        <div className='single-blog-comment' key={comment._id}>
                                            <div className="comment-logo">
                                                <Link to={`/profile/${comment.profile._id}`} >
                                                    <img width={60} height={60} style={{ borderRadius: '50%' }} src={comment.profile.profileUrl} alt="Profile" />
                                                </Link>
                                            </div>
                                            <div className="comment-data">
                                                <Link to={`/profile/${comment.profile._id}`}>
                                                    <h4  >{comment.user.name}</h4>
                                                </Link>
                                                <div style={{ fontSize: 18, marginTop: 5 }} >
                                                    {comment.text}
                                                </div>
                                            </div>
                                            {auth?.user?._id.toString() === comment.user._id.toString() ?
                                                <p className='deleteComment' title='Delete Comment' onClick={() => handleCommentDelete(comment._id)} ><Icon color='red' name='delete' /></p>
                                                : null
                                            }
                                        </div>
                                    ))
                                    :
                                    <div>
                                        <p>No comments yet</p>
                                    </div>
                                }

                                {/* Comments Section */}
                                {auth?.user?.token ?
                                    <Fragment>
                                        <h2>Write a comment....</h2>
                                        <Form onSubmit={commentOnSubmit}>
                                            <Form.Field>
                                                <textarea rows={3} placeholder='Write your comment here' value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                                            </Form.Field>
                                            <Button type='submit' secondary>Post comment</Button>
                                        </Form>
                                        <br />
                                    </Fragment>
                                    : null
                                }
                                <br />
                            </div>
                        </Fragment>
            }
        </Fragment>
    )
}

export default SingleBlog