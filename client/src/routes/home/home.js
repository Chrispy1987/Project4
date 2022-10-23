import './home.css'
import axios from 'axios';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Groups } from '../groups/Groups'
import { Invites } from '../invites/Invites'
import { helper } from '../../js/components/helper'

export const Home = (props) => {
    const [groupState, setGroupState] = useState(null)
    const [triggerGroup, setTriggerGroup] = useState(0)
    const [inviteState, setInviteState] = useState(null)
    const [triggerInvite, setTriggerInvite] = useState(0)

    const userId = props.session;
    
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
            })
    }, [triggerGroup])

    // Check for pending group invites
    useEffect(() => {
        axios.get(`/groups/invite/${userId}`)
            .then((dbRes) => {                
                const invites = dbRes.data.invites;
                setInviteState(invites)
                console.log(invites)
            })
            .catch(e => {
                e.response.status === 500 
                ? props.handleToast('We are having trouble retrieving your pending invites. Please try again later!')
                : props.handleToast(e.response.data.toast)
            })
    }, [triggerInvite])

    // Delete target group and refresh UI
    const handleGroupDeletion = async (event, groupId) => {
        if (event.target.textContent === 'Delete Group') {
            event.target.textContent = 'Confirm Delete';
            event.target.style.color = 'red';
            setTimeout(() => {
                event.target.textContent = 'Delete Group';
                event.target.style.color = 'black';
            }, 3000);            
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

    return (
        <div className='grid'>
            <div className='grid-col1'>                
                <div className='pending-invites'>
                    {inviteState && <h2>PENDING INVITES</h2>}
                    {inviteState && inviteState.map(invite => {
                            return (
                                <Invites
                                    key={invite.invite_id}
                                    groupId={invite.group_id}
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
            <div className='grid-col2'> {/* MAIN SECTION */}
                <div className='grid-row1'>
                </div>
                <div className='grid-row2'>
                    {groupState && <h2>YOUR GROUPS</h2>}
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
                            />
                        )
                    })
                    : <div>
                        <p>You are not part of any groups (use image)</p>
                        <Link to='/create'><button>CREATE A GROUP</button></Link>
                        </div>
                    }
                </div>
            </div>
            <div className='grid-col3'>
            </div>
        </div>
    )
}


