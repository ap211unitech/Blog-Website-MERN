import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { Button, Form, Icon, Loader, Modal, Table } from 'semantic-ui-react';
import { formatDate } from '../app/helpers';
import { addCategory, deleteCategory, editCategoryAction, getAllCategory } from '../features/category/categorySlice';
import { getMyProfile } from '../features/profile/profileSlice';
import { toast } from 'react-toastify';

const checkIfPrimeUser = ({ email }) => {
    let emails = ['porwalarjun95@gmail.com'];
    if (emails.includes(email)) return true;
    return false;
}

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
        if (window.confirm('All the blogs belongs to this category would also get delete. Are you sure to delete it ?')) {
            const payload = { categoryId: id, prime: checkIfPrimeUser(user) }
            const res = await dispatch(deleteCategory(payload));
            if (res.type === '/category/delete/rejected') {
                toast.error(res.payload)
            }
            else if (res.type === '/category/delete/fulfilled') {
                toast.success(res.payload.msg)
            }
        }
    }

    const [addCategoryValue, setAddCategoryValue] = useState('');
    const [addCategoryBtnLoading, setAddCategoryBtnLoading] = useState(false);
    const handleAddCategory = async (e) => {
        e.preventDefault();
        setAddCategoryBtnLoading(true);
        const res = await dispatch(addCategory({ name: addCategoryValue }));
        if (res.type === "/category/create/rejected") {
            toast.error(res.payload);
        }
        else if (res.type === "/category/create/fulfilled") {
            toast.success('Category created')
        }
        setAddCategoryBtnLoading(false);
    }

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editCategory, setEditCategory] = useState({});
    const handleEditIconClick = (category) => {
        setEditModalOpen(true);
        setEditCategory(category);
    }

    const handleEditCategory = async () => {
        const payload = { name: editCategory.name, categoryId: editCategory._id, prime: checkIfPrimeUser(user) }
        const res = await dispatch(editCategoryAction(payload));
        if (res.type === '/category/edit/rejected') {
            toast.error(res.payload);
        }
        else if (res.type === '/category/edit/fulfilled') {
            toast.success('Category Updated');
        }
        setEditModalOpen(false);
    }

    return (
        <Fragment>
            {/* Modal for editing category */}
            <Modal
                onClose={() => setEditModalOpen(false)}
                onOpen={() => setEditModalOpen(true)}
                open={editModalOpen}
                header='Edit Category'
                content={
                    <Fragment>
                        <div style={{ margin: 18 }}>
                            <Form>
                                <Form.Field>
                                    <input value={editCategory?.name} onChange={(e) =>
                                        setEditCategory({ ...editCategory, name: e.target.value })
                                    } />
                                </Form.Field>
                                <Button onClick={handleEditCategory} secondary>Edit</Button>
                            </Form>
                        </div>
                    </Fragment>
                }
            />

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
                                <Form.Button fluid type='button' loading={addCategoryBtnLoading} content='Add Category' secondary width={3} onClick={handleAddCategory} />
                            </Form.Group>
                        </Form>
                    </div>
                    <Table singleLine celled striped padded>
                        <Table.Header>
                            <Table.Row textAlign='center'>
                                <Table.HeaderCell collapsing>Author</Table.HeaderCell>
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
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flexStart', cursor: 'pointer' }} onClick={() => navigate(`/profile/${cat.profile._id}`)} >
                                                <img src={cat.profile.profileUrl} style={{ borderRadius: '50%' }} width={50} height={50} alt="profile" />
                                                <p style={{ marginLeft: 9, fontSize: 16, color: '#4183c4' }} >{cat.user.name}</p>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell>{cat.name}</Table.Cell>
                                        <Table.Cell>{formatDate(cat.updatedAt)}</Table.Cell>
                                        {checkIfPrimeUser(user) ? // If it is prime user, then allow all actions 
                                            <Fragment>
                                                <Table.Cell>
                                                    {/* Edit Category */}
                                                    <span style={{ cursor: 'pointer', marginRight: 5 }} onClick={() => handleEditIconClick(cat)}>
                                                        <Icon name='edit outline' size='large' color='blue' />
                                                    </span>
                                                    {/* Delete Category */}
                                                    <span style={{ cursor: 'pointer' }}>
                                                        <Icon name='delete' size='large' color='red' onClick={() => handleCategoryDelete(cat._id)} />
                                                    </span>
                                                </Table.Cell>
                                            </Fragment>
                                            :
                                            cat.user._id === user._id ? // else admins can edit/delete thier category only
                                                <Table.Cell>
                                                    {/* Edit Category */}
                                                    <span style={{ cursor: 'pointer', marginRight: 5 }} onClick={() => handleEditIconClick(cat)}>
                                                        <Icon name='edit outline' size='large' color='blue' />
                                                    </span>
                                                    {/* Delete Category */}
                                                    <span style={{ cursor: 'pointer' }}>
                                                        <Icon name='delete' size='large' color='red' onClick={() => handleCategoryDelete(cat._id)} />
                                                    </span>
                                                </Table.Cell>
                                                :
                                                <Table.Cell>-------------</Table.Cell>
                                        }
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