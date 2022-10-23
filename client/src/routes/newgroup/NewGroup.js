import './NewGroup.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

export const NewGroup = (props) => {

    const [count, setCount] = useState(0)
    const [groupNumber, setGroupNumber] = useState(null)

    useEffect(() => {
        console.log('group number updated', groupNumber)
        console.log(typeof(groupNumber))
    }, [groupNumber])

    const handleGroupName = async (event) => {
        const userInput = (event.currentTarget.value).toUpperCase();
        event.currentTarget.value = userInput;
        if (userInput.length < 3) {
            event.currentTarget.style.color = 'black'
            event.currentTarget.style.fontWeight = 'normal'
        } else {
            event.currentTarget.style.color = 'green'
            event.currentTarget.style.fontWeight = 'bold'
            const data = {
                ownerId: props.session,
                name: userInput,
                groupId: groupNumber
            }   
            try {
                const dbRes = await axios.post('/groups/new', data)
                dbRes.data.groupId && setGroupNumber(dbRes.data.groupId)
                setCount(count + 1)
                console.log('COUNT', count)
            } catch(e) {
                props.handleToast(e)
                return
            }                          
        }         
    }

    const handleGroupInvite = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget);
        const data = {
            invitee: formData.get('invite'),
            inviter: props.session,
            groupId: groupNumber
        };
        let dbRes;
        try {
            dbRes = await axios.post('/groups/invite', data)
            props.handleToast(dbRes.data.toast)
        } catch (e) {
            e.response.status === 500 
                ? props.handleToast('We are having trouble sending the invite. Please try again later!')
                : props.handleToast(e.response.data.toast)
            return
        }
    }

    return (
        <div className='grid'>
            <div className='grid-col1'>
            </div>
            <div className='grid-col2'>
                <div className='grid-row1'>
                </div>
                <div className='grid-row2'>
                    <p>CREATE A GROUP - [user {props.session} - group {groupNumber}]</p>
                    <form>
                        <span>My group name is... </span>
                        <input onChange={event => handleGroupName(event)} id='group-name' name='groupName' placeholder='Enter group name...' maxLength='20'/>
                    </form>
                    {count > 0 && 
                        <div id='invite-container'>
                            <p>Add up to 3 friends (enter username or email)</p>
                            <div id='invite-forms'>
                                <form className='invite-form' onSubmit={event => handleGroupInvite(event)}>
                                    <input onChange={event => ''} className='group-invite' name='invite' required/>
                                    <button>Invite</button>
                                </form>
                                <form className='invite-form' onSubmit={event => handleGroupInvite(event)}>
                                    <input onChange={event => ''} className='group-invite' name='invite' required/>
                                    <button>Invite</button>
                                </form>
                                <form className='invite-form' onSubmit={event => handleGroupInvite(event)}>
                                    <input onChange={event => ''} className='group-invite' name='invite' required/>
                                    <button>Invite</button>  
                                </form>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className='grid-col3'>
            </div>
        </div>
    )
}