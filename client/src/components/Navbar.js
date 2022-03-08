import React, { Fragment, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authReset, logout } from '../features/auth/authSlice';

function Navbar() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const location = useLocation();
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
                        <Menu.Item
                            name='logout'
                            active={activeItem === 'logout'}
                            onClick={handleItemClick}
                        />
                    }
                </Menu.Menu>
            </Menu>
        </Fragment>
    )
}

export default Navbar