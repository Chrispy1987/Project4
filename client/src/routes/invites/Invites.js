import './Invites.css'
import axios from 'axios'

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
           <p>INVITED TO GROUP: {props.groupId}</p>
           <p>INVITED BY USER: {props.inviter}</p>
           <form className='invite-decision' onSubmit={e => e.preventDefault()}>
                <input type='hidden' name='groupId' value={props.groupId}></input>
                <button onClick={ () => handleInviteDecision('accept')}>Accept</button>
                <button onClick={ () => handleInviteDecision('decline')}>Decline</button>
           </form>
        </div>
    )
}