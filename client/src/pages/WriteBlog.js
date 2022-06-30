import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Icon, Loader, Message, Select } from 'semantic-ui-react';
import { CLOUDINARY_USER_NAME } from '../config/defaults';
import axios from 'axios';
import { toast } from 'react-toastify';
import { writeNewBlog } from '../features/blog/blogSlice';
import { getAllCategory } from '../features/category/categorySlice';
import TextEditor from '../components/TextEditor';
import { EditorState } from 'draft-js';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';


const WriteBlog = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [allCategories, setAllCategories] = useState([]);

    const auth = useSelector(state => state.auth);
    const category = useSelector(state => state.category);
    const { profile } = useSelector(state => state.profile);

    useEffect(async () => {

        if (!profile?.isActivated) {
            navigate('/');
            return;
        }

        if (auth.user && auth.user.token) {
            const res = await dispatch(getAllCategory());
            if (res.type === '/category/get/rejected') {
                toast.error(res.payload);
                return;
            }
            const data = []
            res.payload.map(e => data.push({ text: e.name, key: e._id, value: e._id }))
            setAllCategories(data);
        }
        else {
            navigate('/');
        }

    }, [auth, profile, dispatch, navigate])

    const [title, setTitle] = useState('');
    const [content, setContent] = useState(EditorState.createEmpty());
    const [image, setImage] = useState('');
    const [selectCategory, setSelectCategory] = useState(null);

    // console.log(draftToHtml(convertToRaw(content.getCurrentContent())))

    const createBlog = async (e) => {
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
            category: selectCategory
        }

        // return

        const res = await dispatch(writeNewBlog(data));
        if (res.type === '/blog/write/rejected') {
            toast.error(res.payload);
            return
        }
        toast.success('Blog Published successfully');
        setTitle('');
        setContent(EditorState.createEmpty());
        setImage('');
        setSelectCategory(null);
        navigate(`/blog/${res.payload.blog._id}`);
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

    return (
        <Fragment>
            <Grid centered>
                <Grid.Row >
                    <Icon name='edit' size='huge' />
                    <h1 style={{ marginLeft: 8, position: 'relative', bottom: '12px' }}>
                        Write a new blog
                    </h1>
                </Grid.Row>
            </Grid>
            <h2 style={{ textAlign: 'center', color: 'gray' }}>
                Create a new blog and share your knowledge
            </h2>
            <section style={{ margin: 'auto', width: '70%', textAlign: 'center' }}>
                <Message info size='large'>
                    <p>Blog may look different from what it will look here. Kindly edit your blog for making it good looking.</p>
                </Message>
            </section>

            <Grid centered>
                <div className="write">

                    {cloudinaryUploadLoading ?
                        <Loader active content='Publishing Blog...' /> :
                        <Fragment>
                            {
                                image &&
                                <img
                                    className="writeImg"
                                    src={URL.createObjectURL(image)}
                                    alt="image"
                                />
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
                            <form className="writeForm" onSubmit={createBlog}>
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
                                    Publish
                                </Button>
                            </form>
                        </Fragment>
                    }
                </div>
            </Grid>
        </Fragment>
    )
}

export default WriteBlog