import './home.css'
import axios from 'axios';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Groups } from '../groups/Groups'
import { NewGroup } from '../newgroup/NewGroup'
import { ViewGroup } from '../viewGroup/ViewGroup'
import { Invites } from '../invites/Invites'
import { helper } from '../../js/components/helper'

export const Home = (props) => {
    const [groupState, setGroupState] = useState(null)
    const [triggerGroup, setTriggerGroup] = useState(0)
    const [inviteState, setInviteState] = useState(null)
    const [triggerInvite, setTriggerInvite] = useState(0)
    const [groupNumber, setGroupNumber] = useState(null)

    const userId = props.session;
    console.log('PANEL:', props.panel )

    // Get groups that the user belongs to
    useEffect(() => {
        axios.get(`/groups/member/${userId}`)
            .then((dbRes) => {                
                const groups = dbRes.data.groups;
                setGroupState(groups)
            })
            .catch(e => {
                e.response.status === 500 
                ? props.handleToast('We are having trouble retrieving your groups. Please try again later!')
                : props.handleToast(e.response.data.toast)
                return
            })
    }, [triggerGroup])

    // Check for pending group invites
    useEffect(() => {
        axios.get(`/groups/invite/${userId}`)
            .then((dbRes) => {                
                const invites = dbRes.data.invites;
                setInviteState(invites)
            })
            .catch(e => {
                e.response.status === 500 
                ? props.handleToast('We are having trouble retrieving your pending invites. Please try again later!')
                : props.handleToast(e.response.data.toast)
            })
    }, [triggerInvite])

    // Delete target group and refresh UI
    const handleGroupDeletion = async (event, groupId) => {
        if (event.target.textContent === 'Delete') {
            event.target.textContent = 'Confirm Delete';
            event.target.className = 'button-confirm'
            setTimeout(() => {
                event.target.textContent = 'Delete';
                event.target.className = ''
            }, 4000);            
        } else {
            try {
                const dbRes = await axios.delete(`groups/${groupId}`)
                props.handleToast(dbRes.data.toast)
                setTriggerGroup(triggerGroup + 1)    
            } catch (e) {
                props.handleToast(e)
            }
        }
    };

    // View group
    const handleViewGroup = (groupId) => {
        setGroupNumber(groupId)
        props.setPanel('view')
    }

    return (
        <div className='grid'>
            <div className='grid-col1'> {/* LEFT PANEL */}                
                <div className='pending-invites'>
                    {inviteState && inviteState.map(invite => {
                            return (
                                <Invites
                                    key={invite.invite_id}
                                    groupId={invite.group_id}
                                    groupName={invite.name}
                                    inviter={invite.inviter}
                                    session={props.session}
                                    handleToast={() => props.handleToast()}
                                    triggerInvite={triggerInvite}
                                    setTriggerInvite={setTriggerInvite}
                                    triggerGroup={triggerGroup}
                                    setTriggerGroup={setTriggerGroup}
                                />
                            )
                        })
                    }
                </div>
            </div>
            <div className='grid-col2'> {/* MAIN PANEL */}
                <div className='grid-row1'>
                </div>
                <div className='grid-row2'>
                    {props.panel === 'groups' && 
                        <>
                            <div className='header-flex'>
                                <h2 id='group-header' className='grid-header'>YOUR GROUPS</h2>
                                <button className='action-button' onClick={()=> props.setPanel('create')}> + New Group</button>
                            </div>
                            {groupState ? groupState.map((group) => {
                                return (
                                    <Groups
                                        key={group.group_id}
                                        name={group.name}
                                        owner={helper.capitaliseFirstLetter(group.owner)}
                                        ownerId={group.owner_id}
                                        groupId={group.group_id}
                                        session={props.session}
                                        handleGroupDeletion={handleGroupDeletion}
                                        handleToast={() => props.handleToast()}
                                        handleViewGroup={handleViewGroup}
                                        setPanel={props.setPanel}
                                    />
                                )
                            })
                            : <div>
                                <p>You are not part of any groups (use image)</p>
                                <button onClick={()=> {props.setPanel('create')}}>CREATE A GROUP</button>
                                </div>
                            }
                        </>
                    }
                    {props.panel === 'create' &&
                        <>
                            <NewGroup 
                            session={props.session}
                            handleToast={props.handleToast}
                            triggerGroup={triggerGroup}
                            setTriggerGroup={setTriggerGroup}
                            setPanel={props.setPanel}
                            />
                        </>                    
                    }
                    {props.panel === 'view' &&
                        <>
                            <ViewGroup
                                key={`view-${groupNumber}`}
                                groupId={groupNumber}
                                session={props.session}
                                handleToast={props.handleToast}
                                triggerGroup={triggerGroup}
                                setTriggerGroup={setTriggerGroup}
                                setPanel={props.setPanel}
                            />
                        </>
                    }
                    
                </div>
            </div>
            <div className='grid-col3'> {/* RIGHT PANEL */}
            </div>
        </div>
    )
}


