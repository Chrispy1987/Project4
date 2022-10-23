import './Groups.css'
import axios from 'axios';
import { useState, useEfect, useRef, useEffect } from 'react'
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
            <div className='group-container'>
                <div id='group-details'>
                    <h2>{props.name}</h2>
                    <p>Created by: {props.owner}</p>
                    <p>Group Id: {props.groupId}</p>
                    <p>MEMBERS:
                    {memberState && 
                    memberState.map((member, index) => {
                            return <span key={index}> {helper.capitaliseFirstLetter(member.username)}{index < memberState.length -1 && ', '}</span>})
                    }
                    </p>
                </div>
                <div id='group-buttons'>
                    <button>View Group</button>
                    { props.session == props.ownerId && 
                        <button onClick={(event) => props.handleGroupDeletion(event, props.groupId)}>Delete Group</button>}
                </div>
            </div>
        </div>
    )
}
