import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { Button, Form, Icon, Loader, Modal, Segment, Table } from 'semantic-ui-react';
import { formatDate } from '../app/helpers';
import { toast } from 'react-toastify';
import { getAllUsers } from '../features/admin/adminSlice';


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

    return (
        <Fragment>
            {isLoading ?
                <Fragment>
                    <Loader active content='Loading authors' />
                </Fragment>
                :
                <Fragment>
                    <Table singleLine textAlign='center'>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Author</Table.HeaderCell>
                                <Table.HeaderCell>Email</Table.HeaderCell>
                                <Table.HeaderCell>Blogs</Table.HeaderCell>
                                <Table.HeaderCell>Contact</Table.HeaderCell>
                                <Table.HeaderCell>Setting</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {usersList?.map(curruser =>
                                <Fragment key={curruser._id}>
                                    <Table.Row textAlign='center'>
                                        <Table.Cell>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => navigate(`/profile/${curruser.profile._id}`)} >
                                                <img src={curruser.profile.profileUrl} style={{ borderRadius: '50%' }} width={50} height={50} alt="profile" />
                                                <p style={{ marginLeft: 9, fontSize: 16, color: '#4183c4' }} >{curruser.name}</p>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>
                                            {curruser.email}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {curruser.blogs.length} blogs written
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Button as='a' href={`mailto:${curruser.email}`} icon='mail' label='Send Message' />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Button icon='setting' />
                                        </Table.Cell>
                                    </Table.Row>
                                </Fragment>
                            )}
                        </Table.Body>
                    </Table>
                </Fragment>
            }


        </Fragment>
    )
}

export default Authors