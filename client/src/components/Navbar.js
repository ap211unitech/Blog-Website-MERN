import React, { Fragment, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Dropdown, Icon } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authReset, logout } from '../features/auth/authSlice';
import { getMyProfile } from '../features/profile/profileSlice';

function Navbar() {


    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { profile } = useSelector(state => state.profile);
    const location = useLocation();

    // This is because our profile and user schema are diffrent and causing me difficuly. It's too late to change them.
    const [profileId, setProfileId] = useState('');

    useEffect(() => {
        if (profile) setProfileId(profile._id);
        else {
            const paths = ['/', '/update-profile']
            if (user && user.token && !paths.includes(location.pathname)) {
                dispatch(getMyProfile());
            }
        }
    }, [profile])

    const pathName = location.pathname;
    const path = pathName === "/" ? "home" : pathName.substr(1);
    const [activeItem, setActiveItem] = useState(path);

    useEffect(() => {
        const pathName = window.location.pathname;
        const path = pathName === "/" ? "home" : pathName.substr(1);
        setActiveItem(path);
    }, [user, navigate])

    const handleItemClick = (e, { name }) => {
        setActiveItem(name);
        if (name === 'logout') {
            dispatch(logout());
            dispatch(authReset());
            navigate('/');
        }
    }

    return (
        <Fragment>
            <Menu pointing secondary size='massive' color='teal'>
                <Menu.Item
                    name='home'
                    active={activeItem === 'home'}
                    onClick={handleItemClick}
                    as={Link}
                    to='/'
                />
                {user ?
                    <Menu.Item
                        name='write'
                        active={activeItem === 'write'}
                        onClick={handleItemClick}
                        as={Link}
                        to='/write'
                    /> : null
                }
                <Menu.Menu position='right'>
                    {!user ?
                        <Fragment>
                            <Menu.Item
                                name='register'
                                active={activeItem === 'register'}
                                onClick={handleItemClick}
                                as={Link}
                                to='/register'
                            />
                            <Menu.Item
                                name='login'
                                active={activeItem === 'login'}
                                onClick={handleItemClick}
                                as={Link}
                                to='/login'
                            />
                        </Fragment>
                        :
                        <Fragment>
                            <Dropdown text={<Fragment><Icon name='user' />{user.name}</Fragment>} pointing className='link item'>
                                <Dropdown.Menu>
                                    <Dropdown.Item as={Link} to='/account'>
                                        <Icon name='setting' />  Your Account
                                    </Dropdown.Item>
                                    {profile ?
                                        <Dropdown.Item as={Link} to={`/profile/${profileId}`}>
                                            <Icon name='user' />  Your Profile
                                        </Dropdown.Item> : null
                                    }
                                    <Dropdown.Item as={Link} to='/update-profile'>
                                        <Icon name='edit' />  Edit Profile
                                    </Dropdown.Item>
                                    <Dropdown.Item as={Link} to='/change-password'>
                                        <Icon name='key' />  Change Password
                                    </Dropdown.Item>
                                    <Dropdown.Item name='logout' onClick={handleItemClick}>
                                        <Icon name='sign-in' />   Logout
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Fragment>
                    }
                </Menu.Menu>
            </Menu>
        </Fragment>
    )
}

export default Navbar