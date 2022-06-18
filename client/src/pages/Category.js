import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { Form, Icon, Loader, Table } from 'semantic-ui-react';
import { formatDate } from '../app/helpers';
import { addCategory, deleteCategory, getAllCategory } from '../features/category/categorySlice';
import { getMyProfile } from '../features/profile/profileSlice';
import { toast } from 'react-toastify';

function Category() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);
    const { categories, isLoading } = useSelector(state => state.category);

    useEffect(async () => {

        const res = await dispatch(getMyProfile());

        if (!user || !user.token || res.payload.role !== "admin") {
            navigate('/');
            return
        }

        if (!categories) {
            dispatch(getAllCategory());
        }

    }, [navigate, dispatch])

    const handleCategoryDelete = async (id) => {
        const res = await dispatch(deleteCategory(id));
        if (res.type === '/category/delete/rejected') {
            toast.error(res.payload)
        }
        else if (res.type === '/category/delete/fulfilled') {
            toast.success(res.payload.msg)
        }
    }

    const [addCategoryValue, setAddCategoryValue] = useState('');
    const handleAddCategory = async (e) => {
        e.preventDefault();

        const res = await dispatch(addCategory({ name: addCategoryValue }));
        if (res.type === "/category/create/rejected") {
            toast.error(res.payload);
        }
        else if (res.type === "/category/create/fulfilled") {
            toast.success('Category created')
        }

    }

    return (
        <Fragment>
            {isLoading ?
                <Fragment>
                    <Loader active content='Loading categories...' />
                </Fragment>
                :
                <Fragment>
                    <div style={{ width: '70%', margin: 'auto' }} >
                        <Form>
                            <Form.Group>
                                <Form.Input placeholder='Category' width={13}>
                                    <input type="text" value={addCategoryValue} onChange={(e) => setAddCategoryValue(e.target.value)} />
                                </Form.Input>
                                <Form.Button fluid type='button' content='Add Category' secondary width={3} onClick={handleAddCategory} />
                            </Form.Group>
                        </Form>
                    </div>
                    <Table singleLine textAlign='center'>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Author</Table.HeaderCell>
                                <Table.HeaderCell>Category</Table.HeaderCell>
                                <Table.HeaderCell>Last Updated at</Table.HeaderCell>
                                <Table.HeaderCell>Edit/Delete</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {categories?.map(cat =>
                                <Fragment key={cat._id}>
                                    <Table.Row textAlign='center'>
                                        <Table.Cell>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => navigate(`/profile/${cat.profile._id}`)} >
                                                <img src={cat.profile.profileUrl} style={{ borderRadius: '50%' }} width={50} height={50} alt="profile" />
                                                <p style={{ marginLeft: 9, fontSize: 16, color: '#4183c4' }} >{cat.user.name}</p>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>{cat.name}</Table.Cell>
                                        <Table.Cell>{formatDate(cat.updatedAt)}</Table.Cell>
                                        <Table.Cell>
                                            <span style={{ cursor: 'pointer' }}>
                                                <Icon name='edit outline' size='large' color='blue' />
                                            </span>
                                            {/* Delete Category (Not in functionality) */}
                                            {/* <span style={{ cursor: 'pointer' }}>
                                                <Icon name='delete' size='large' color='red' onClick={() => handleCategoryDelete(cat._id)} />
                                            </span> */}
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

export default Category