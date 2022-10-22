import './home.css'
import axios from 'axios';
import { useState, useEfect, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Groups } from '../groups/Groups'
import { NewGroup } from '../newgroup/NewGroup'
import { helper } from '../../js/components/helper'

export const Home = (props) => {
    const [groupState, setGroupState] = useState(null)
    const [refreshState, setRefreshState] = useState(0)

    // get groups that the user belongs to
    useEffect(() => {
        const userId = props.session;
        axios.get(`/user/groups/member/${userId}`)
            .then((dbRes) => {
                const groups = dbRes.data.groups;
                setGroupState(groups)
            })
                .catch((err) => {
                    err.response.status === 500 
                    ? props.handleToast('We are having trouble retrieving your groups. Please try again later!')
                    : props.handleToast(err.response.data.toast)
            })
    }, [refreshState])

    const handleGroupDeletion = (event, groupId) => {
        if (event.target.textContent === 'Delete Group') {
            event.target.textContent = 'Confirm Delete';
            setTimeout(() => {
                event.target.textContent = 'Delete Group';
            }, 2000);            
        } else {
            axios.delete(`user/groups/${groupId}`)
                .then((dbRes) => {
                    setRefreshState(refreshState + 1)
                    props.handleToast(dbRes.data.toast)
                })
        }
    };

    return (
        <div className='grid'>
            <div className='grid-col1'>
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
                        <p>You are not part of any groups</p>
                        <Link to='/create'><button onClick>CREATE A GROUP</button></Link>
                        </div>
                    }
                </div>
            </div>
            <div className='grid-col3'>
            </div>
        </div>
    )
}


