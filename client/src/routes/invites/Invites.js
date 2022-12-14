import './Invites.css'
import axios from 'axios'
import { helper } from '../../js/components/helper'

// Generate pending invites
export const Invites = (props) => {
    const handleInviteDecision = async (decision) => {
        const data = {
            groupId: props.groupId,
            userId: props.session
        }
        if (decision === 'decline') {
            try {
                await axios.post('/groups/invite/decline', data)
            } catch (e) {
                e.response.status === 500 
                    ? props.handleToast('We are having trouble declining the group invite. Please try again later!')
                    : props.handleToast(e.response.data.toast)
                    return
            } 
        } else {
            try {
                await axios.post('/groups/invite/accept', data)
            } catch (e) {
                e.response.status === 500 
                    ? props.handleToast('We are having trouble accepting the group invite. Please try again later!')
                    : props.handleToast(e.response.data.toast)
                    return
            }            
        }
        props.setTriggerInvite(props.triggerInvite + 1)
        props.setTriggerGroup(props.triggerGroup + 1)
    }

    return (
        <div className='invites'>
            <div className='invite-header'>
                <div className='invite-header-item'>
                    <p><b>Pending invite to:</b></p> 
                    <p className='invite-name'>{props.groupName}</p>
                </div>
                <div className='invite-header-item'>
                    <p><b>Invited by:</b></p> 
                    <p className='invite-inviter'>{helper.capitaliseFirstLetter(props.inviter)}</p>
                </div>
            </div>           
           <form className='invite-decision' onSubmit={e => e.preventDefault()}>
                <input type='hidden' name='groupId' value={props.groupId}></input>
                <div className='invite-buttons'>
                    <button className='invite-button' onClick={ () => handleInviteDecision('accept')}>Accept</button>
                    <button className='invite-button' onClick={ () => handleInviteDecision('decline')}>Decline</button>
                </div>
           </form>
        </div>
    )
}