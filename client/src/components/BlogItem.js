import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Icon, Label, Grid, Button } from 'semantic-ui-react';
import { extractDescriptionFromHTML, formatDate } from '../app/helpers';
import { deleteBlog } from '../features/blog/blogSlice';

function BlogItem({ blog, role }) {

    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDeleteBlog = async (blogId) => {
        if (window.confirm('Do you surely want to delete your blog?')) {
            const res = await dispatch(deleteBlog({ id: blogId, prime: role === 'admin' }));
            if (res.type === '/blog/delete/rejected') {
                toast.error(res.payload);
                return;
            }
            else if (res.type === '/blog/delete/fulfilled') {
                toast.success('Blog deleted successfully');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        }
    }

    return (
        <Fragment>
            <Grid.Row key={blog._id} >
                <Grid.Column width={13} verticalAlign='middle' >
                    <div className='latestBlogAuthor'>
                        <Link to={`/profile/${blog.profile._id}`} >
                            <img style={{ borderRadius: '50%', margin: 'auto 6px -11px auto' }} src={blog.profile.profileUrl} width={35} height={35} alt="Profile Image" />
                            {' '}  {blog.user.name}
                        </Link>
                        <span style={{ color: 'grey', marginLeft: 5 }}>
                            Last updated on {formatDate(blog.updatedAt)}
                        </span>
                    </div>
                    <h2 style={{ margin: '20px 0px 0px 0px', padding: 0 }} > {blog.title}</h2>
                    <p style={{ fontSize: 16, paddingTop: 5, wordWrap: 'break-word', marginBottom: 10 }} >
                        {extractDescriptionFromHTML(blog.desc).substr(0, 300)}...........
                        <Link to={`/blog/${blog._id}`} className='blog-read-more-button' >Read more</Link>
                    </p>
                    {auth?.user?.token && auth.user._id === blog.user._id ?
                        <div style={{ display: 'flex', margin: '10px auto 13px auto' }}>
                            <div style={{}}>
                                <Button secondary type='button' as={Link} to={`/edit`} state={{ blog: blog }}>
                                    Edit Blog
                                </Button>
                            </div>

                            <div style={{ marginLeft: 10 }}>
                                <Button color='red' basic type='button' onClick={() => handleDeleteBlog(blog._id)}>
                                    Delete Blog
                                </Button>
                            </div>
                        </div>
                        : null
                    }
                    {role === 'admin' && auth.user._id !== blog.user._id &&
                        <div style={{ display: 'flex', margin: '10px auto 13px auto' }}>
                            <div style={{}}>
                                <Button secondary type='button' as={Link} to={`/edit`} state={{ blog: blog }}>
                                    Edit Blog
                                </Button>
                            </div>

                            <div style={{ marginLeft: 10 }}>
                                <Button color='red' basic type='button' onClick={() => handleDeleteBlog(blog._id)}>
                                    Delete Blog
                                </Button>
                            </div>
                        </div>
                    }
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
                    <img height={'70%'} width={'90%'} alt='Blog Image' src={blog.coverPhoto} />
                </Grid.Column>
            </Grid.Row>
        </Fragment>
    )
}

export default BlogItem