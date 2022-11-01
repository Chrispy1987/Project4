import './NewGroup.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

export const NewGroup = (props) => {

    const [groupStatus, setGroupStatus] = useState(false)
    const [groupNumber, setGroupNumber] = useState(null)

    useEffect(() => {
        groupNumber && console.log('group number created', groupNumber)
    }, [groupNumber])

    const handleGroupName = async (event) => {
        const userInput = (event.currentTarget.value).toUpperCase();
        event.currentTarget.value = userInput;
        if (userInput.length < 4) {
            props.handleToast('Your group name is too short')
            event.currentTarget.select()
            event.currentTarget.focus()
        } else {
            const data = {
                ownerId: props.session,
                name: userInput,
                groupId: groupNumber
            }
            let dbRes;
            try {
                dbRes = await axios.post('/groups/new', data);              
            } catch(e) {
                e.response.status === 500 
                    ? props.handleToast('We are having trouble creating the group. Please try again later!')
                    : props.handleToast(e.response.data.toast)
                return
            }
            dbRes.data.groupId && setGroupNumber(dbRes.data.groupId);
            props.setTriggerGroup(props.triggerGroup + 1);
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
        <div>
            <div className='header-flex'>
                <h2 id='group-header' className='grid-header'>CREATE NEW GROUP</h2>
                <button className='action-button back' onClick={()=> props.setPanel('groups')}>Go Back</button>
            </div>
            <div className='form-container'>
                <form className='form-col'>
                    <input className='group-name' onChange={() => !groupStatus && setGroupStatus(!groupStatus)} onBlur={event => handleGroupName(event)} id='group-name' name='groupName' placeholder='Enter group name...' maxLength='24'/>
                </form>
                {groupStatus && 
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
                        <button className='action-button finalise' onClick={()=>props.setPanel('groups')}>FINALISE</button>
                    </div>
                }
            </div>
        </div>
    )
}