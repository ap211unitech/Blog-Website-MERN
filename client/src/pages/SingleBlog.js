import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Image, Loader, Message } from 'semantic-ui-react';
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
                            <div>
                                <Grid>
                                    <h1>{singleBlog.title}</h1>
                                    <Image src={singleBlog.coverPhoto} alt="Blog Cover Photo" />
                                    <p style={{ fontSize: 16 }}>{singleBlog.desc}</p>
                                </Grid>
                            </div>
                        </Fragment>
            }
        </Fragment>
    )
}

export default SingleBlog