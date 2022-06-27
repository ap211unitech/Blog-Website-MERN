import React, { Fragment, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { authReset, sendActivationMail } from '../features/auth/authSlice';
import { profileReset, getMyProfile, customProfileReset } from '../features/profile/profileSlice';
import { Grid, Message, Icon, Label, Loader, Menu, Header, Input } from 'semantic-ui-react'
import { blogReset, getBlogsByCategoryId, getLatestBlogs } from '../features/blog/blogSlice';
import { extractDescriptionFromHTML, formatDate, searchBlogs } from '../app/helpers';
import { getAllCategory } from '../features/category/categorySlice';

const renderBlogsData = (blogs, activeCategory) => {
    return (
        <Grid>
            {blogs ?
                blogs.length === 0 ?
                    <h4 style={{ marginTop: 40 }}>
                        No blogs found
                    </h4>
                    :
                    blogs.map(blog => (
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
                                <h2 style={{ margin: '20px 0px 0px 0px', padding: 0, wordWrap: 'break-word' }} > {blog.title}</h2>
                                <p style={{ fontSize: 16, paddingTop: 5, wordWrap: 'break-word', marginBottom: 10 }} >
                                    {extractDescriptionFromHTML(blog.desc).substr(0, 300)}...........
                                    <Link to={`/blog/${blog._id}`} className='blog-read-more-button' >Read more</Link>
                                </p>
                                <Label>{blog.category.name}</Label>
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
                                <img height={'65%'} width={'100%'} alt='Blog Image' src={blog.coverPhoto} />
                            </Grid.Column>
                        </Grid.Row>
                    ))
                : <Loader active content={activeCategory !== 'all blogs' ? 'Loading blogs of selected category' : 'Loading Latest Blogs'} />
            }
        </Grid>
    )
}


function Landing() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isSuccess, successMessage } = useSelector(state => state.auth);
    const { profile, isError, errorMessage } = useSelector(state => state.profile);
    const blog = useSelector(state => state.blog);
    const { categories } = useSelector(state => state.category);
    const [activeCategory, setActiveCategory] = useState('');

    useEffect(() => {

        dispatch(getLatestBlogs());
        setActiveCategory('all blogs');

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

    const sendActivationMailAgain = async () => {
        await dispatch(sendActivationMail());
        dispatch(customProfileReset());
        dispatch(authReset());
    }

    useEffect(() => {
        // Get all categories
        dispatch(getAllCategory());
    }, [user, navigate, dispatch])

    const handleCategoryClick = async (e, data) => {
        await setActiveCategory(data.name);
        if (data.index === "all blogs") {
            await dispatch(getLatestBlogs());
            return;
        }
        await dispatch(getBlogsByCategoryId({ categoryId: data.index }));
    }

    const [searchVal, setSearchVal] = useState('');
    const [searchedBlogsResult, setSearchedBlogsResult] = useState([]);
    useEffect(() => {
        if (blog?.latestBlogs) {
            const searchedBlogs = searchBlogs(blog?.latestBlogs, searchVal);
            setSearchedBlogsResult(searchedBlogs);
        }
    }, [blog, searchVal])

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

            {/* Search Blogs */}
            <Grid centered>
                <Grid.Column width={16}>
                    <Input
                        icon='search'
                        iconPosition='left'
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        focus
                        placeholder='Search blogs by author or title . . . . . .'
                    />
                </Grid.Column>
            </Grid>

            <Grid>
                <Grid.Column width={4}>
                    <Header style={{ marginLeft: 16 }}>
                        All Categories
                    </Header>
                    <Menu color='teal' pointing secondary vertical>
                        <Menu.Item
                            name={'all blogs'}
                            key={'all blogs'}
                            index={'all blogs'}
                            active={activeCategory === 'all blogs'}
                            onClick={handleCategoryClick}
                        />
                        {categories?.map(category => {
                            return <Menu.Item
                                name={category.name}
                                key={category._id}
                                index={category._id}
                                active={activeCategory === category.name}
                                onClick={handleCategoryClick}
                            />
                        })}
                    </Menu>
                </Grid.Column>
                <Grid.Column width={12}>

                    {/* Render Blogs */}
                    {searchVal ?
                        renderBlogsData(searchedBlogsResult, activeCategory) : // when search val is not null, find blogs from selected category using key and render them
                        renderBlogsData(blog.latestBlogs, activeCategory) // when search val is null, render blogs of selected category
                    }

                    {/* We can render data from writting this condition also. renderBlogsData(searchedBlogsResult, activeCategory). But for more clarification, using conditional rendering */}

                </Grid.Column>
            </Grid>

        </Fragment>
    )
}

export default Landing