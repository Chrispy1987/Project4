import './Groups.css'
import axios from 'axios';
import { useState, useEffect } from 'react'
import { helper } from '../../js/components/helper'


export const Groups = (props) => {
    const [memberState, setMemberState] = useState(null)
 
    // get group members
    useEffect(() => {
        const groupId = props.groupId;
        axios.get(`/groups/${groupId}`)
            .then((dbRes) => {
                const members = dbRes.data.members;
                setMemberState(members);
            })
            .catch((err) => {
                err.response.status === 500 
                ? props.handleToast('We are having trouble retrieving group members. Please try again later!')
                : props.handleToast(err.response.data.toast)
            })
    }, [])

    return (
        <div>
            <div className='group-container fade-in'>
                <div className='group-details'>
                    <h2>{props.name}</h2>
                    <p><b>Created by:</b> {props.owner}</p>
                    <p><b>Members:</b>
                    {memberState && 
                    memberState.map((member, index) => {
                            return <span key={index}> {helper.capitaliseFirstLetter(member.username)}{index === memberState.length -2 ? ' & ' : index < memberState.length -1 && ', '}</span>})
                    }
                    </p>
                </div>
                <div className='group-buttons'>
                    <button onClick={()=> props.handleViewGroup(props.groupId)}>View</button>
                    { props.session == props.ownerId && 
                        <button onClick={event => props.handleGroupDeletion(event, props.groupId)}>Delete</button>}
                </div>
            </div>
        </div>
    )
}
