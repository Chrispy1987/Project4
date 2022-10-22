import './Groups.css'
import axios from 'axios';
import { useState, useEfect, useRef, useEffect } from 'react'


export const Groups = (props) => {
    // const [memberState, setMemberState] = useState(null)
    // console.log('group rendering')
    // get group members
    // useEffect(() => {
    //     console.log('group use effecting')
    //     const groupId = props.groupId;
    //     console.log(groupId)
    //     axios.get(`/user/groups/${groupId}`)
    //         .then((dbRes) => {
    //             const members = dbRes.data.members;
    //             console.log(members)
    //             setMemberState(memberState)
    //         })
    //         .catch((err) => {
    //             console.log(err)
    //         })
    // }, [])

    return (
        <div className='group-container'>
            <div id='group-details'>
                <h2>{props.name}</h2>
                <p>Created by: {props.ownerId}</p>
                {/* <p>Members: {memberState.map(member => member.user_id)} </p> */}
                <p>Group Id: {props.groupId}</p>
            </div>
            <div id='group-buttons'>
                <button>View Group</button>
                <button>Delete Group - if owner</button>
            </div>
        </div>
    )
}
