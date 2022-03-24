import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { getAnyUserProfile, customProfileReset } from '../features/profile/profileSlice';
import { toast } from 'react-toastify';
import { Button, Grid, Modal, Icon, Loader, Message, List, Image } from 'semantic-ui-react';



function SingleProfile() {

    const { profileId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = useSelector(state => state.auth);
    const { otherProfile, isLoading, isError, errorMessage } = useSelector(state => state.profile);

    const [showPeopleViewedModal, setShowPeopleViewedModal] = useState(false);
    const peopleViewedClick = () => {
        setShowPeopleViewedModal(!showPeopleViewedModal);
    }

    useEffect(async () => {
        setShowPeopleViewedModal(false);
        await dispatch(getAnyUserProfile(profileId));
        dispatch(customProfileReset());
    }, [dispatch, navigate])

    return (
        <Fragment>
            {/* People who viewed profile modal */}
            <Modal
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
                                    <p style={{ paddingLeft: 5, color: '#2185d0' }}> {user.user.name}</p>
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
                                    {auth && auth.user && otherProfile.user._id === auth.user._id
                                        ?
                                        <Button secondary as={Link} to='/update-profile'>
                                            Edit Profile
                                        </Button> :
                                        <div></div>
                                    }
                                </div>
                                <div className='vff'>
                                    {auth && auth.user && otherProfile.user._id === auth.user._id ?
                                        <div className="viewedBy" onClick={peopleViewedClick}>
                                            {otherProfile.profile.viewedBy.length}  People viewed your profile
                                        </div> : null
                                    }
                                    <div className="followers">
                                        {otherProfile.profile.followers.length} Followers
                                    </div>
                                    <div className="following">
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

                    </Fragment>
                    :
                    <Message error floating content='No such profile exists!' />
            }
        </Fragment>
    )
}

export default SingleProfile