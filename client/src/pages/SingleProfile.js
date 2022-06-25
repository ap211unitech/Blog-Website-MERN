import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { getAnyUserProfile, customProfileReset, followAnyUserProfile, getMyProfile } from '../features/profile/profileSlice';
import { toast } from 'react-toastify';
import { Button, Modal, Icon, Loader, Message, List, Image, Label, Grid } from 'semantic-ui-react';
import { extractDescriptionFromHTML, formatDate } from '../app/helpers';

function SingleProfile() {

    const { profileId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = useSelector(state => state.auth);
    const { otherProfile, isLoading, isError, errorMessage } = useSelector(state => state.profile);

    const [toggleFollowProfileLoading, settoggleFollowProfileLoading] = useState(false);
    const toggleFollowProfileClick = async () => {
        settoggleFollowProfileLoading(true);
        const res = await dispatch(followAnyUserProfile(profileId));
        if (res.type === 'profile/follow/rejected') {
            toast.error(res.payload);
        }
        else if (res.type === 'profile/follow/fulfilled') {

        }
        settoggleFollowProfileLoading(false);
        dispatch(customProfileReset());
    }

    const [showPeopleViewedModal, setShowPeopleViewedModal] = useState(false);
    const peopleViewedClick = () => {
        setShowPeopleViewedModal(!showPeopleViewedModal);
    }

    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const followersClick = () => {
        setShowFollowersModal(!showFollowersModal);
    }

    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const followingClick = () => {
        setShowFollowingModal(!showFollowingModal);
    }

    useEffect(async () => {
        setShowPeopleViewedModal(false);
        setShowFollowersModal(false);
        setShowFollowingModal(false);
        await dispatch(getAnyUserProfile(profileId));
        dispatch(customProfileReset());
    }, [dispatch, navigate])

    return (
        <Fragment>
            {/* People who viewed profile modal */}
            <Modal
                closeIcon
                open={showPeopleViewedModal}
                onClose={peopleViewedClick}
                size='mini'
            >
                <Modal.Header>People who viewed your profile</Modal.Header>
                <Modal.Content scrolling>
                    <List verticalAlign='middle'>
                        {otherProfile && otherProfile.profile && otherProfile.profile.viewedBy ?
                            otherProfile.profile.viewedBy.map(user => <List.Item key={user._id} className='peopleWhoViewedYourProfileList' >
                                <List.Content floated='right'>
                                    <Button basic color='black' as={Link} to={`/profile/${user.profile._id}`}> Visit Profile </Button>
                                </List.Content>
                                <Image avatar src={user.profile.profileUrl} alt="Profile Image" />
                                <List.Content >
                                    <p style={{ paddingLeft: 5, color: 'rgb(66, 73, 175)' }}> {user.user.name}</p>
                                </List.Content>
                            </List.Item>
                            )
                            : null}
                    </List>
                </Modal.Content>
            </Modal>

            {/* Followers Modal */}
            <Modal
                closeIcon
                open={showFollowersModal}
                onClose={followersClick}
                size='mini'
            >
                <Modal.Header>Followers</Modal.Header>
                <Modal.Content scrolling>
                    <List verticalAlign='middle'>
                        {otherProfile && otherProfile.profile && otherProfile.profile.followers ?
                            otherProfile.profile.followers.map(user => <List.Item key={user._id} className='peopleWhoViewedYourProfileList' >
                                <List.Content floated='right'>
                                    <Button basic color='black' as={Link} to={`/profile/${user.profile._id}`}> Visit Profile </Button>
                                </List.Content>
                                <Image avatar src={user.profile.profileUrl} alt="Profile Image" />
                                <List.Content >
                                    <p style={{ paddingLeft: 5, color: 'rgb(66, 73, 175)' }}> {user.user.name}</p>
                                </List.Content>
                            </List.Item>
                            )
                            : null}
                    </List>
                </Modal.Content>
            </Modal>

            {/* Following Model */}
            <Modal
                closeIcon
                open={showFollowingModal}
                onClose={followingClick}
                size='mini'
            >
                <Modal.Header>Following</Modal.Header>
                <Modal.Content scrolling>
                    <List verticalAlign='middle'>
                        {otherProfile && otherProfile.profile && otherProfile.profile.following ?
                            otherProfile.profile.following.map(user => <List.Item key={user._id} className='peopleWhoViewedYourProfileList' >
                                <List.Content floated='right'>
                                    <Button basic color='black' as={Link} to={`/profile/${user.profile._id}`}> Visit Profile </Button>
                                </List.Content>
                                <Image avatar src={user.profile.profileUrl} alt="Profile Image" />
                                <List.Content >
                                    <p style={{ paddingLeft: 5, color: 'rgb(66, 73, 175)' }}> {user.user.name}</p>
                                </List.Content>
                            </List.Item>
                            )
                            : null}
                    </List>
                </Modal.Content>
            </Modal>

            {isError && !isLoading ?
                <Fragment>
                    {errorMessage.map(err => { <Message error floating content={err} /> })}
                </Fragment> : null
            }
            {!otherProfile ? <Loader active>Loading profile</Loader>
                :
                otherProfile.profile && otherProfile.user ?
                    <Fragment>
                        <section style={{ background: 'black', overflow: 'hidden', height: 350, marginBottom: 10 }}>
                            <img src={otherProfile.profile.profileUrl} width={'100%'} height={350} alt="Profile Image" style={{ objectFit: 'cover', opacity: 0.4 }} />
                        </section>
                        <div className="profile">
                            <div className="profileImage">
                                <img src={otherProfile.profile.profileUrl} alt="Profile Image" />

                            </div>
                            <div className="profileData">
                                <div className="profileTitle">
                                    <h2> {otherProfile.user.name}</h2>
                                    <div style={{ marginBottom: 10 }}>
                                        {otherProfile.profile.isActivated ?
                                            <Label.Group>
                                                <Label size='medium' as='a' tag color='green'>
                                                    Verified Account
                                                </Label>
                                            </Label.Group> :
                                            <Label.Group>
                                                <Label size='medium' as='a' tag color='red'>
                                                    Unverified Account
                                                </Label>
                                            </Label.Group>
                                        }
                                    </div>
                                    {auth && auth.user && otherProfile.user._id === auth.user._id
                                        ?
                                        <Fragment>

                                            <Button secondary as={Link} to='/update-profile'>
                                                Edit Profile
                                            </Button>
                                        </Fragment>

                                        :
                                        <div></div>
                                    }

                                    {auth && auth.user && otherProfile.user._id !== auth.user._id ?
                                        otherProfile.profile.followers.find(user => user.user._id === auth.user._id)
                                            ?
                                            <Button secondary basic loading={toggleFollowProfileLoading} onClick={toggleFollowProfileClick}>
                                                Unfollow
                                            </Button> :
                                            <Button secondary loading={toggleFollowProfileLoading} onClick={toggleFollowProfileClick}>
                                                Follow
                                            </Button>
                                        :
                                        <div></div>
                                    }

                                    {auth && auth.user && otherProfile.user._id !== auth.user._id ?
                                        <Button as='a' href={`mailto:${auth.user.email}`} icon='mail' label='Send Message' />
                                        :
                                        <div></div>
                                    }

                                </div>

                                <div style={{ marginLeft: 50, marginBottom: 16, marginTop: -10, fontSize: 16 }} >
                                    Joined at {formatDate(otherProfile.profile.createdAt)}
                                </div>

                                <div className='vff'>

                                    {auth && auth.user && otherProfile.user._id === auth.user._id ?
                                        <div className="viewedBy" onClick={peopleViewedClick}>
                                            {otherProfile.profile.viewedBy.length}  People viewed your profile
                                        </div> : null
                                    }
                                    <div className="followers" onClick={followersClick}>
                                        {otherProfile.profile.followers.length} Followers
                                    </div>
                                    <div className="following" onClick={followingClick}>
                                        {otherProfile.profile.following.length} Following
                                    </div>
                                </div>
                                <div className="social">
                                    {otherProfile.profile.social ?
                                        <Fragment>
                                            {otherProfile.profile.social.github ?
                                                <a href={otherProfile.profile.social.github} target="_blank">
                                                    <Icon name='github' size='big' />
                                                </a> : null
                                            }
                                            {otherProfile.profile.social.linkedin ?
                                                <a href={otherProfile.profile.social.linkedin} target="_blank">
                                                    <Icon name='linkedin' size='big' />
                                                </a> : null
                                            }
                                            {otherProfile.profile.social.twitter ?
                                                <a href={otherProfile.profile.social.twitter} target="_blank">
                                                    <Icon name='twitter' size='big' />
                                                </a> : null
                                            }
                                            {otherProfile.profile.social.facebook ?
                                                <a href={otherProfile.profile.social.facebook} target="_blank">
                                                    <Icon name='facebook' size='big' />
                                                </a> : null
                                            }
                                            {otherProfile.profile.social.youtube ?
                                                <a href={otherProfile.profile.social.youtube} target="_blank">
                                                    <Icon name='youtube' size='big' />
                                                </a> : null
                                            }
                                            {otherProfile.profile.social.instagram ?
                                                <a href={otherProfile.profile.social.instagram} target="_blank">
                                                    <Icon name='instagram' size='big' />
                                                </a> : null
                                            }
                                        </Fragment>
                                        : null
                                    }
                                </div>
                                <div className="bio">
                                    {otherProfile.profile.bio}
                                </div>
                            </div>
                        </div>

                        {/* Blogs of current profile */}
                        <div className="user-blogs">
                            {otherProfile.blogs.length ?
                                <Fragment>
                                    {/* <Message floating header={`Blogs by ${otherProfile.user.name.split(' ')[0]}`} /> */}
                                    <Grid>
                                        {otherProfile.blogs.map(blog => (
                                            <Grid.Row key={blog._id} >
                                                <Grid.Column width={13} verticalAlign='middle' >
                                                    <div className='latestBlogAuthor'>
                                                        <Link to={`/profile/${blog.profile._id}`} >
                                                            <img style={{ borderRadius: '50%', margin: 'auto 6px -11px auto' }} src={blog.profile.profileUrl} width={35} height={35} alt="Profile Image" />
                                                            {' '}  {blog.user.name}
                                                        </Link>
                                                        <span style={{ color: 'grey', marginLeft: 5 }}>
                                                            Last updated on {formatDate(blog.updatedAt)}
                                                        </span>
                                                    </div>
                                                    <h2 style={{ margin: '20px 0px 0px 0px', padding: 0 }} > {blog.title}</h2>
                                                    <p style={{ fontSize: 16, paddingTop: 5, wordWrap: 'break-word', marginBottom: 10 }} >
                                                        {extractDescriptionFromHTML(blog.desc).substr(0, 300)}...........
                                                        <Link to={`/blog/${blog._id}`} className='blog-read-more-button' >Read more</Link>
                                                    </p>
                                                    <Label >{blog.category.name}</Label>
                                                    <div className='latestBlogLDC' >
                                                        <p>
                                                            <Icon name='eye' />
                                                            {blog.viewedBy.length}
                                                        </p>
                                                        <p>
                                                            <Icon name='thumbs up' />
                                                            {blog.likes.length}
                                                        </p>
                                                        <p>
                                                            <Icon name='thumbs down' />
                                                            {blog.dislikes.length}
                                                        </p>
                                                        <p>
                                                            <Icon name='comments' />
                                                            {blog.comments.length}
                                                        </p>
                                                    </div>
                                                </Grid.Column>
                                                <Grid.Column width={3}>
                                                    <img height={'70%'} alt='Blog Image' src={blog.coverPhoto} />
                                                </Grid.Column>
                                            </Grid.Row>
                                        ))}
                                    </Grid>
                                </Fragment>
                                : null
                            }

                        </div>
                    </Fragment>
                    :
                    <Message error floating content='No such profile exists!' />
            }
        </Fragment>
    )
}

export default SingleProfile