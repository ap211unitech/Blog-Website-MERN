import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Grid, Image, Loader, Message, Icon } from 'semantic-ui-react';
import { getBlogByBlogID } from '../features/blog/blogSlice';

function SingleBlog() {

    const { blogId } = useParams();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { singleBlog, isLoading, isError, errorMessage } = useSelector(state => state.blog)
    console.log(singleBlog, isError, errorMessage);

    useEffect(() => {

        dispatch(getBlogByBlogID(blogId));

    }, [navigate, dispatch])

    return (
        <Fragment>
            {isError && !isLoading ?
                <Fragment>
                    {errorMessage.map(err => (<Message error floating content={err} />))}
                </Fragment> : null
            }
            {
                isLoading ? <Loader active>Loading Blog</Loader>
                    :
                    !singleBlog ? <Message error floating content={'No such blog found'} />
                        :
                        <Fragment>

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


                            <div className="single-blog-vldc">
                                <p>
                                    <Icon name='eye' />
                                    {singleBlog.viewedBy.length}
                                </p>
                                <p>
                                    <Icon name='thumbs up' />
                                    {singleBlog.likes.length}
                                </p>
                                <p>
                                    <Icon name='thumbs down' />
                                    {singleBlog.dislikes.length}
                                </p>
                            </div>

                            <div className='single-blog-header' >
                                <h1>{singleBlog.title}</h1>
                                <img src={singleBlog.coverPhoto} alt="Blog Cover Photo" />
                                <p style={{ fontSize: 16 }}>{singleBlog.desc}</p>
                            </div>
                            <div className="single-blog-content">
                                {singleBlog.content.map(content => (
                                    <Fragment key={content._id}>
                                        <img src={content.image} alt="Photo" />
                                        <h1>{content.desc}</h1>
                                    </Fragment>
                                ))}
                            </div>
                        </Fragment>
            }
        </Fragment>
    )
}

export default SingleBlog