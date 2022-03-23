import React, { useEffect, Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Icon, Grid } from 'semantic-ui-react';
import { CLOUDINARY_USER_NAME } from "../config/defaults";
import axios from 'axios';
import { toast } from 'react-toastify';
import { getMyProfile, editMyProfile } from "../features/profile/profileSlice";

function UpdateProfile() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const { profile, isError, isSuccess, errorMessage, successMessage, isLoading } = useSelector(state => state.profile);

    const [showSocial, setShowSocial] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        profileUrl: 'https://media.istockphoto.com/photos/white-studio-background-picture-id1040250650?k=20&m=1040250650&s=612x612&w=0&h=lEWpioJ3jet0QIZVBoU2Ygaua8YMHFfHN1mvT28xRZ4='
    });

    const [profileImage, setProfileImage] = useState('');

    const [social, setSocial] = useState({
        youtube: '',
        twitter: '',
        linkedin: '',
        instagram: '',
        github: '',
        facebook: ''
    })

    const onSubmit = async (e) => {
        e.preventDefault();
        const profileImage = await profileImageUpload();
        const data = {
            name: formData.name,
            bio: formData.bio,
            profileUrl: profileImage,
            ...social
        }
        console.log(data)
        dispatch(editMyProfile(data));
    }

    const onChangeFormData = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }


    const onChangeSocial = (e) => {
        setSocial({ ...social, [e.target.name]: e.target.value });
    }

    const profileImageUpload = async () => {
        let data = new FormData();
        data.append("file", profileImage);
        data.append("upload_preset", "mern-blog");
        data.append("cloud_name", CLOUDINARY_USER_NAME);
        try {
            const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_USER_NAME}/image/upload`, data);
            return res.data.url;
        } catch (err) {
            console.log(err);
            return profile.profileUrl
        }
    }

    useEffect(() => {
        if (!auth.user) {
            navigate('/');
        }
        else {
            if (!profile) dispatch(getMyProfile());
            if (!isLoading && profile) {
                let formData = {
                    'name': auth.user.name,
                    'bio': profile.bio,
                    'profileUrl': profile.profileUrl
                }
                setFormData({ ...formData });

                let social = {
                    'github': profile.social.github,
                    'twitter': profile.social.twitter,
                    'linkedin': profile.social.linkedin,
                    'instagram': profile.social.instagram,
                    'facebook': profile.social.facebook,
                    'youtube': profile.social.youtube,
                }
                setSocial({ ...social });
            }
        }

        if (isSuccess) {
            successMessage.map(err => toast.success(err));
        }

        if (isError) {
            errorMessage.map(err => toast.error(err));
        }


    }, [isError, isSuccess, dispatch, navigate, profile])

    return (
        <Fragment>
            <Grid centered>
                <Grid.Row >
                    <Icon name='edit' size='huge' />
                    <h1 style={{ marginLeft: 8, position: 'relative', bottom: '12px' }}>
                        Edit Profile
                    </h1>
                </Grid.Row>
            </Grid>
            <h2 style={{ textAlign: 'center', color: 'gray' }}>
                Edit your profile here
            </h2>
            <div className="form-control">
                <Form onSubmit={onSubmit} className={isLoading ? 'loading' : ''}>
                    <Form.Field>
                        <label>Name</label>
                        <input
                            placeholder='Name'
                            name='name'
                            type='text'
                            value={formData.name}
                            onChange={onChangeFormData} />
                    </Form.Field>
                    <Form.Field>
                        <label>Bio</label>
                        <textarea
                            placeholder='Bio'
                            rows={4}
                            name='bio'
                            type='text'
                            value={formData.bio}
                            onChange={onChangeFormData} />
                    </Form.Field>
                    <Form.Field>
                        <label>Profile Image</label>
                        <input
                            type='file'
                            onChange={(e) => setProfileImage(e.target.files[0])} />
                    </Form.Field>
                    <Form.Field>
                        <img src={formData.profileUrl} width={120} height={80} alt="Profile URL" />
                    </Form.Field>
                    <Form.Field>
                        <Button type='button' onClick={() => setShowSocial(!showSocial)}>Add Social Network Links</Button>
                    </Form.Field>
                    {showSocial ?
                        <Fragment>
                            <Form.Field>
                                <label>Github Profile</label>
                                <input
                                    placeholder='Github Profile'
                                    name='github'
                                    type='text'
                                    value={social.github}
                                    onChange={onChangeSocial} />
                            </Form.Field>
                            <Form.Field>
                                <label>Linkedin Profile</label>
                                <input
                                    placeholder='Linkedin Profile'
                                    name='linkedin'
                                    type='text'
                                    value={social.linkedin}
                                    onChange={onChangeSocial} />
                            </Form.Field>
                            <Form.Field>
                                <label>Facebook Profile</label>
                                <input
                                    placeholder='Facebook Profile'
                                    name='facebook'
                                    type='text'
                                    value={social.facebook}
                                    onChange={onChangeSocial} />
                            </Form.Field>
                            <Form.Field>
                                <label>Twitter Profile</label>
                                <input
                                    placeholder='Twitter Profile'
                                    name='twitter'
                                    type='text'
                                    value={social.twitter}
                                    onChange={onChangeSocial} />
                            </Form.Field>
                            <Form.Field>
                                <label>Instagram Profile</label>
                                <input
                                    placeholder='Instagram Profile'
                                    name='instagram'
                                    type='text'
                                    value={social.instagram}
                                    onChange={onChangeSocial} />
                            </Form.Field>
                            <Form.Field>
                                <label>Youtube Profile</label>
                                <input
                                    placeholder='Youtube Profile'
                                    name='youtube'
                                    type='text'
                                    value={social.youtube}
                                    onChange={onChangeSocial} />
                            </Form.Field>
                        </Fragment>
                        :
                        null
                    }
                    {/* <Form.Field>
                        <label>Old Password</label>
                        <input
                            placeholder='Old Password'
                            name='oldPassword'
                            type='password'
                            value={formData.oldPassword}
                            onChange={onChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>New Password</label>
                        <input
                            placeholder='New Password'
                            name='newPassword'
                            type='password'
                            value={formData.newPassword}
                            onChange={onChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Confirm New Password</label>
                        <input
                            placeholder='Confirm Password'
                            name='confirmNewPassword'
                            type='password'
                            value={formData.confirmNewPassword}
                            onChange={onChange}
                        />
                    </Form.Field> */}
                    <Button type='submit' color='teal'>Update Profile</Button>
                </Form>
            </div>
        </Fragment>
    )
}

export default UpdateProfile