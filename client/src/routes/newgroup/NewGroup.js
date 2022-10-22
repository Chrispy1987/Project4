import './NewGroup.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

export const NewGroup = (props) => {

    const [state, setState] = useState(1)
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
                const dbRes = await axios.post('/user/groups/new', data)
                dbRes.data.groupId && setGroupNumber(dbRes.data.groupId)
            } catch(e) {
                props.handleToast(e)
            }
               
        }         
    }

    return (
        <div className='grid'>
            <div className='grid-col1'>
            </div>
            <div className='grid-col2'> {/* MAIN SECTION */}
                <div className='grid-row1'>
                </div>
                <div className='grid-row2'>
                    <p>CREATE A GROUP - user {props.session} - group {groupNumber}</p>
                    <form>
                        <span>My group name is... </span>
                        <input onChange={event => handleGroupName(event)} id='group-name' name='groupName' placeholder='Enter group name...' maxLength='20'/> // Blur
                    </form> 
                    {state > 0 && 
                    <div>
                        <p>Add friends (enter username or email)</p>
                        <div>
                            <form>
                                <input onChange={event => ''} className='group-invite' name='invite'/>
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