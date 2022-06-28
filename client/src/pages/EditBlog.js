import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Icon, Select, Loader, Button, Message } from 'semantic-ui-react';
import { CLOUDINARY_USER_NAME } from '../config/defaults';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { toast } from 'react-toastify';
import axios from 'axios';
import TextEditor from '../components/TextEditor';
import { editBlogByBlogId } from '../features/blog/blogSlice';
import { getAllCategory } from '../features/category/categorySlice';

function EditBlog() {

    const location = useLocation();


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const auth = useSelector(state => state.auth);
    const { profile } = useSelector(state => state.profile);
    const category = useSelector(state => state.category);

    const [title, setTitle] = useState();


    const [content, setContent] = useState();

    const [image, setImage] = useState('');
    const [selectCategory, setSelectCategory] = useState();
    const [allCategories, setAllCategories] = useState([]);

    const editBlog = async (e) => {
        e.preventDefault();

        if (!title || !content || !image) {
            toast.error('All fields must be filled')
            return;
        }

        if (title.length > 170) {
            toast.error('Title is too large. Make it little small.')
            return
        }

        // Check if file size is less than 2MB
        if (image.size / 1000000 > 2) {
            toast.error('File too large. File size should be less than 2 MB.');
            return;
        }

        const coverPhoto = await ImageUpload();
        const data = {
            title,
            desc: draftToHtml(convertToRaw(content.getCurrentContent())),
            coverPhoto,
            category: selectCategory,
            blogId: location?.state?.blog?._id,
            prime: profile?.role === 'admin'
        }

        const res = await dispatch(editBlogByBlogId(data));
        if (res.type === '/blog/edit/rejected') {
            toast.error(res.payload);
            return
        }
        toast.success('Blog edited successfully');
        setTitle('');
        setContent(EditorState.createEmpty());
        setImage('');
        setSelectCategory(null);
        navigate(`/blog/${location?.state?.blog?._id}`)
    }

    const [cloudinaryUploadLoading, setCloudinaryUploadLoading] = useState(false);
    const ImageUpload = async () => {
        setCloudinaryUploadLoading(true);
        let data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "mern-blog");
        data.append("cloud_name", CLOUDINARY_USER_NAME);
        try {
            const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_USER_NAME}/image/upload`, data);
            setCloudinaryUploadLoading(false);
            return res.data.url;
        } catch (err) {
            // console.log(err);
            setCloudinaryUploadLoading(false);
            return null
        }
    }

    useEffect(async () => {
        if (!auth || !auth.user || !auth.user.token) {
            navigate('/');
            return
        }


        if (!location.state || !location.state.blog) {
            navigate('/');
            return
        }

        const res = await dispatch(getAllCategory());
        if (res.type === '/category/get/rejected') {
            toast.error(res.payload);
            return;
        }
        const data = []
        res.payload.map(e => data.push({ text: e.name, key: e._id, value: e._id }))
        setAllCategories(data);

        // Setting All Values
        setTitle(location?.state?.blog?.title);

        const blocksFromHtml = htmlToDraft(location?.state?.blog?.desc);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const editorState = EditorState.createWithContent(contentState);
        setContent(editorState);

        setSelectCategory(location?.state?.blog?.category?._id);
        setImage(location?.state?.blog?.coverPhoto)


    }, [dispatch, navigate])

    return (
        <Fragment>
            <Grid centered>
                <Grid.Row >
                    <Icon name='edit' size='huge' />
                    <h1 style={{ marginLeft: 8, position: 'relative', bottom: '12px' }}>
                        Edit blog
                    </h1>
                </Grid.Row>
            </Grid>
            <h2 style={{ textAlign: 'center', color: 'gray' }}>
                Edit your blog and make it better
            </h2>
            <section style={{ margin: 'auto', width: '70%', textAlign: 'center' }}>
                <Message info size='large'>
                    <p>Blog may look different from what it will look here. Kindly edit your blog for making it good looking.</p>
                </Message>
            </section>

            <Grid centered>
                <div className="write">

                    {cloudinaryUploadLoading ?
                        <Loader active content='Editing Blog...' /> :
                        <Fragment>
                            {
                                image ?
                                    image.toString().startsWith("http") ?
                                        <img
                                            className="writeImg"
                                            src={image}
                                            alt="image"
                                        /> :
                                        <img
                                            className="writeImg"
                                            src={URL.createObjectURL(image)}
                                            alt="image"
                                        /> : null
                            }
                            {category?.categories &&
                                <div style={{ marginTop: 0, fontWeight: 'bold' }}>
                                    <Select
                                        fluid
                                        search
                                        selection
                                        placeholder='Select category'
                                        options={allCategories}
                                        value={selectCategory}
                                        onChange={(e, { value }) => setSelectCategory(value)}
                                    />
                                </div>
                            }
                            <form className="writeForm" onSubmit={editBlog}>
                                <div className="writeFormGroup">
                                    <label htmlFor="fileInput">
                                        <div className="writeIcon">
                                            <Icon name='plus' size='large'></Icon>
                                        </div>
                                    </label>
                                    <input id="fileInput" type="file" style={{ display: "none" }} onChange={e => setImage(e.target.files[0])} />
                                    <input
                                        className="writeInput"
                                        placeholder="Title"
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        autoFocus={true}
                                    />
                                </div>
                                <div className="writeFormGroup">
                                    <TextEditor content={content} setContent={setContent} />
                                </div>
                                <Button color='teal' className="writeSubmit" type="submit">
                                    Edit
                                </Button>
                            </form>
                            <hr style={{ marginBottom: 50, width: '70%', display: 'block', margin: 'auto' }} />
                        </Fragment>
                    }
                </div>
            </Grid>
        </Fragment >
    )
}

export default EditBlog