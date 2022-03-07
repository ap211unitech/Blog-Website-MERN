import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

function Navbar() {

    const pathName = window.location.pathname;
    const path = pathName === "/" ? "home" : pathName.substr(1);
    const [activeItem, setActiveItem] = useState(path);

    const handleItemClick = (e, { name }) => {
        setActiveItem(name)
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
                </Menu.Menu>
            </Menu>
        </Fragment>
    )
}

export default Navbar