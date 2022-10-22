import './home.css'
import axios from 'axios';
import { useState, useEfect, useRef, useEffect } from 'react'
import { Groups } from '../groups/Groups'
import { helper } from '../js/components/helper'

export const Home = (props) => {
    const [groupState, setGroupState] = useState(null)

    // get groups that the user belongs to
    useEffect(() => {
        const userId = props.userId;
        axios.get(`/user/groups/member/${userId}`)
            .then((dbRes) => {
                const groups = dbRes.data.groups;
                console.log(groups)
                setGroupState(groups)
            })
                .catch((err) => {
                    err.response.status === 500 
                    ? props.handleToast('We are having trouble retrieving your groups. Please try again later!')
                    : props.handleToast(err.response.data.toast)
            })
    }, [])

    return (
        <div className='grid'>
            <div className='grid-col1'>
            </div>
            <div className='grid-col2'> {/* MAIN SECTION */}
                <div className='grid-row1'>
                    <h2>YOUR GROUPS</h2>
                </div>
                <div className='grid-row2'>
                    {groupState 
                    ? groupState.map((group) => {
                        {console.log(group)}
                        return (
                            <Groups
                                key={group.group_id}
                                name={group.name}
                                ownerId={helper.capitaliseFirstLetter(group.owner)}
                                groupId={group.group_id}
                            />
                        )
                    })
                    : <div>implement NewGroup Component</div>
                    }
                </div>
            </div>
            <div className='grid-col3'>
            </div>
        </div>
    )
}


