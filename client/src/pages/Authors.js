import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { Button, Grid, Input, Loader, Table } from 'semantic-ui-react';
import { formatDate, searchAuthors } from '../app/helpers';
import { toast } from 'react-toastify';
import { getAllUsers } from '../features/admin/adminSlice';

const checkIfPrimeUser = ({ email }) => {
    let emails = ['porwalarjun95@gmail.com'];
    if (emails.includes(email)) return true;
    return false;
}

const renderUserData = (usersList, user, navigate) => {

    return (
        <Table.Body>
            {usersList?.map(curruser =>
                <Fragment key={curruser._id}>
                    <Table.Row textAlign='center'>
                        <Table.Cell>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flexStart', cursor: 'pointer' }} onClick={() => navigate(`/profile/${curruser.profile._id}`)} >
                                <img src={curruser.profile.profileUrl} style={{ borderRadius: '50%' }} width={50} height={50} alt="profile" />
                                <p style={{ marginLeft: 9, fontSize: 16, color: '#4183c4' }} >{curruser.name}</p>
                            </div>
                        </Table.Cell>
                        <Table.Cell>
                            {curruser.email}
                        </Table.Cell>
                        <Table.Cell>
                            {formatDate(curruser.createdAt)}
                        </Table.Cell>
                        <Table.Cell>
                            {curruser.profile.role === 'admin' ?
                                <Button color='green' content='Admin' /> :
                                curruser.blogs.length > 0 ?
                                    <Button color='blue' content='Author' /> :
                                    <Button content='Viewer' />
                            }
                        </Table.Cell>
                        <Table.Cell>
                            <Button as='a' href={`mailto:${curruser.email}`} icon='mail' label='Send Message' />
                        </Table.Cell>
                        <Table.Cell>
                            {curruser.profile.role === 'admin' ?
                                checkIfPrimeUser(user) ?
                                    <Button as={Link} to={'/edit/author'} state={{ user: curruser }} icon='setting' label='Edit Details' /> :
                                    <Fragment>-------------</Fragment>
                                :
                                <Button as={Link} to={'/edit/author'} state={{ user: curruser }} icon='setting' label='Edit Details' />
                            }
                        </Table.Cell>
                    </Table.Row>
                </Fragment>
            )}
        </Table.Body>
    )
}

function Authors() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);
    const { profile } = useSelector(state => state.profile);
    const { usersList, isLoading } = useSelector(state => state.admin);

    useEffect(async () => {

        if (!user || !user.token) {
            navigate('/');
            return
        }

        if (!profile) return;

        if (profile.role !== "admin") {
            navigate('/');
            return
        }

        const res = await dispatch(getAllUsers());
        if (res.type === "/admin/getAllUsers/rejected") {
            toast.error(res.payload)
        }

    }, [profile, navigate, dispatch])

    const [searchVal, setSearchVal] = useState('');
    const [searchedUsersResult, setSearchedUsersResult] = useState([]);
    useEffect(() => {
        if (usersList) {
            const searchedUsers = searchAuthors(usersList, searchVal);
            setSearchedUsersResult(searchedUsers);
        }
    }, [usersList, searchVal])

    return (
        <Fragment>
            {/* Search Box Authors */}
            <Grid centered>
                <Grid.Column width={16}>
                    <Input
                        icon='search'
                        iconPosition='left'
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        focus
                        placeholder='Search users by thier name / role / email . . . . . .'
                    />
                </Grid.Column>
            </Grid>

            {isLoading ?
                <Fragment>
                    <Loader active content='Loading authors' />
                </Fragment>
                :
                <Fragment>
                    <Table singleLine celled striped padded>
                        <Table.Header>
                            <Table.Row textAlign='center'>
                                <Table.HeaderCell collapsing>Author</Table.HeaderCell>
                                <Table.HeaderCell>Email</Table.HeaderCell>
                                <Table.HeaderCell>User Creation date</Table.HeaderCell>
                                <Table.HeaderCell>User Role</Table.HeaderCell>
                                {/* <Table.HeaderCell>Blogs</Table.HeaderCell> */}
                                <Table.HeaderCell>Contact</Table.HeaderCell>
                                <Table.HeaderCell>Setting</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        {/* Render Users Data */}
                        {searchVal ?
                            renderUserData(searchedUsersResult, user, navigate) :
                            renderUserData(usersList, user, navigate)
                        }

                        {/* We can render data from writting this condition also. renderUserData(searchedUsersResult, user, navigate). But for more clarification, using conditional rendering */}

                    </Table>
                    <br />
                </Fragment>
            }


        </Fragment>
    )
}

export default Authors