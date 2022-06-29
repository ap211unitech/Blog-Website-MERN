import React, { Fragment } from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { Button, Grid, Icon, Image, Label, Loader, Menu } from 'semantic-ui-react';
import { formatDate } from '../app/helpers';
import BlogItem from '../components/BlogItem';
import { getUserDetails, toggleUserBlock, toggleUserRole } from '../features/admin/adminSlice';

const checkReactedBlogs = (blogs) => {
    return blogs.filter(blog => {
        if (blog.likes.length || blog.dislikes.length || blog.comments.length) return blog;
    })
}

function EditAuthor() {

    const location = useLocation();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const auth = useSelector(state => state.auth);
    const { profile } = useSelector(state => state.profile);
    const [user, setUser] = useState({});
    const [loadingCompleteUserData, setLoadingCompleteUserData] = useState(false);
    const [activeItem, setActiveItem] = useState('');

    useEffect(async () => {
        if (!auth || !auth.user || !auth.user.token) {
            navigate('/');
            return
        }
        if (!location.state || !location.state.user) {
            navigate('/');
            return
        }

        setLoadingCompleteUserData(true);
        setActiveItem('published');
        // Get complete user data from userId
        const res = await dispatch(getUserDetails({ userId: location.state.user._id }));
        if (res.type === '/admin/getUserDetails/rejected') {
            navigate('/authors');
            toast.error(res.payload);
            return;
        }
        setUser(res.payload);
        setLoadingCompleteUserData(false);

    }, [])

    // Toggle User role
    const [toggleRoleLoading, setToggleRoleLoading] = useState(false);
    const toggleRole = async () => {
        setActiveItem('published');
        await setToggleRoleLoading(true);
        const res = await dispatch(toggleUserRole({ userId: user._id }));
        if (res.type === '/admin/toggleRole/rejected') {
            toast.error(res.payload);
        }
        else if (res.type === '/admin/toggleRole/fulfilled') {
            await setUser(res.payload);
            toast.success('User Role changed successfully.')
        }
        await setToggleRoleLoading(false);
    }

    // Block a user
    const [toggleBlockLoading, setToggleBlockLoading] = useState(false);
    const toggleBlock = async () => {
        setActiveItem('published');
        await setToggleBlockLoading(true);
        const res = await dispatch(toggleUserBlock({ userId: user._id }));
        if (res.type === '/admin/toggleBlock/rejected') {
            toast.error(res.payload);
        }
        else if (res.type === '/admin/toggleBlock/fulfilled') {
            if (res.payload.profile.isBlocked) {
                toast.error('User blocked.')
            }
            else if (!res.payload.profile.isBlocked) {
                toast.success('User unblocked.')
            }
            await setUser(res.payload);
        }
        await setToggleBlockLoading(false);
    }

    const handleMenuItemClick = async (name) => {
        setActiveItem(name);
        if (name === 'published') {
            // Get all blogs of current user
            const res = await dispatch(getUserDetails({ userId: location.state.user._id }));
            if (res.type === '/admin/getUserDetails/rejected') {
                navigate('/authors');
                toast.error(res.payload);
                return;
            }
            setUser(res.payload);
        }
        else if (name === 'reacted') {
            const filteredBlogs = checkReactedBlogs(user?.blogs);
            setUser((prev) => ({ ...prev, 'blogs': filteredBlogs }));
        }
    }

    return (
        <Fragment>
            {loadingCompleteUserData && <Loader content="Loading user data" active />}
            <Grid centered>
                <Grid.Row >
                    <img src="https://cdn-icons-png.flaticon.com/512/2522/2522138.png" width={80} height={80} alt="" />
                    <h1 style={{ marginLeft: 8, position: 'relative', bottom: '12px' }}>
                        Edit author details
                    </h1>
                </Grid.Row>
            </Grid>
            <h2 style={{ textAlign: 'center', color: 'gray' }}>
                Edit an author/user detail here as you're admin
            </h2>

            {user && user.profile &&
                <div className="profile" style={{ marginTop: 50 }}>
                    <div className="profileImage">
                        <Image
                            src={user.profile?.profileUrl}
                            label={{
                                as: 'a',
                                color: user.profile?.role === 'admin' ? 'green' : user.blogs?.length > 0 ? 'blue' : '#3498db',
                                content: user.profile?.role === 'admin' ? 'Admin' : user.blogs?.length > 0 ? 'Author' : 'Viewer',
                                size: 'large',
                                ribbon: true,
                            }}
                            alt="Profile Image"
                        />
                    </div>
                    <div className="profileData">
                        <div className="profileTitle">
                            <h2> {user.name}</h2>
                            <div style={{ marginBottom: 10 }}>
                                {user.profile?.isActivated ?
                                    <Label.Group>
                                        <Label size='medium' as='a' tag color='green'>
                                            Verified Account
                                        </Label>
                                    </Label.Group> :
                                    <Label.Group>
                                        <Label size='medium' as='a' tag color='red'>
                                            Unverified Account
                                        </Label>
                                    </Label.Group>
                                }
                            </div>

                            <Button secondary basic as={Link} to={`/profile/${user.profile._id}`}>
                                Visit Profile
                            </Button>

                            {/* Admin Should not see toggle Buttons for him  */}
                            {user._id !== auth.user._id ?
                                <Fragment>
                                    {/* Toggle user role */}
                                    <Fragment>
                                        <Button primary onClick={toggleRole} loading={toggleRoleLoading} disabled={toggleRoleLoading}>
                                            Toggle Role
                                        </Button>
                                    </Fragment>

                                    {/* Toggle Block */}
                                    {user.profile.isBlocked ?
                                        <Fragment>
                                            <Button color='red' basic onClick={toggleBlock} loading={toggleBlockLoading} disabled={toggleBlockLoading}>
                                                Unblock
                                            </Button>
                                        </Fragment>
                                        :
                                        <Fragment>
                                            <Button color='red' onClick={toggleBlock} loading={toggleBlockLoading} disabled={toggleBlockLoading}>
                                                Block User
                                            </Button>
                                        </Fragment>
                                    }

                                </Fragment> :
                                null
                            }


                        </div>

                        <div style={{ marginLeft: 50, marginBottom: 16, marginTop: -10, fontSize: 16 }} >
                            Joined at {formatDate(user.profile?.createdAt)}
                        </div>

                        <div className="social">
                            {user.profile?.social ?
                                <Fragment>
                                    {user.profile.social.github ?
                                        <a href={user.profile.social.github} target="_blank">
                                            <Icon name='github' size='big' />
                                        </a> : null
                                    }
                                    {user.profile.social.linkedin ?
                                        <a href={user.profile.social.linkedin} target="_blank">
                                            <Icon name='linkedin' size='big' />
                                        </a> : null
                                    }
                                    {user.profile.social.twitter ?
                                        <a href={user.profile.social.twitter} target="_blank">
                                            <Icon name='twitter' size='big' />
                                        </a> : null
                                    }
                                    {user.profile.social.facebook ?
                                        <a href={user.profile.social.facebook} target="_blank">
                                            <Icon name='facebook' size='big' />
                                        </a> : null
                                    }
                                    {user.profile.social.youtube ?
                                        <a href={user.profile.social.youtube} target="_blank">
                                            <Icon name='youtube' size='big' />
                                        </a> : null
                                    }
                                    {user.profile.social.instagram ?
                                        <a href={user.profile.social.instagram} target="_blank">
                                            <Icon name='instagram' size='big' />
                                        </a> : null
                                    }
                                </Fragment>
                                : null
                            }
                        </div>
                        <div className="bio">
                            {user.profile?.bio}
                        </div>
                    </div>
                </div>
            }
            {/* Blogs Menu */}
            <Menu pointing secondary>
                <Menu.Item
                    name={`Published ${user?.blogs && activeItem === 'published' ? `(${user?.blogs?.length})` : ``}`}
                    active={activeItem === 'published'}
                    onClick={() => handleMenuItemClick('published')}
                />
                <Menu.Item
                    name={`Reacted ${user?.blogs && activeItem === 'reacted' ? `(${user?.blogs?.length})` : ``}`}
                    active={activeItem === 'reacted'}
                    onClick={() => handleMenuItemClick('reacted')}
                />
            </Menu>
            <Fragment>
                <Grid>
                    {user?.blogs?.map(blog => <BlogItem key={blog._id} blog={blog} role={profile?.role} />)}
                </Grid>
            </Fragment>

        </Fragment>
    )
}

export default EditAuthor