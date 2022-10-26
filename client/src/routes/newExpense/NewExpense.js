import './NewExpense.css'
import { useState, useEffect, Component } from 'react'
import axios from 'axios'
import { helper } from '../../js/components/helper'

// PROPS PASSED INTO COMPONENT                        
{/* <NewExpense 
groupId = {groupInfo.group_id}
session = {props.session}
handleToast = {props.handleToast}
getGroupInfo = {getGroupInfo}
/> */}

export const NewExpense = (props) => {

    const [members, setMembers] = useState(null)
    const [total, setTotal] = useState(null)
    const [allocated, setAllocated] = useState(Number(0))

    // get group members
    useEffect(()=> {
        const groupId = props.groupId;
        axios.get(`/groups/${groupId}`)
            .then((dbRes) => {
                const members = dbRes.data.members;
                setMembers(members)
            })
            .catch((err) => {
                err.response.status === 500 
                ? props.handleToast('We are having trouble retrieving group members. Please try again later!')
                : props.handleToast(err.response.data.toast)
            })
    }, [])

    const handleNewExpense = async (event) => {
        event.preventDefault();

        if (allocated !== total) {
            props.handleToast('You must allocate the entire expense!')
            return
        }

        const formData = new FormData(event.target.form)

        const data = {
            creator: props.session,
            groupId: props.groupId,
            icon: formData.get('icon'),
            description: formData.get('description'),
            total: formData.get('total'),
            users: formData.getAll('userId'),
            allocations: formData.getAll('amount'), 
            date: new Date()
        }

        console.log(data)

        if (data.icon === null) {
            props.handleToast('Please select an expense type')
            return
        }
        
        try {
            const dbRes = await axios.post('/groups/expense', data)
            console.log(dbRes)
            props.handleToast(dbRes.data.toast)
        } catch(e) {
            e.response.status === 500 
                ? props.handleToast('We are having trouble saving your expense. Please try again later!')
                : props.handleToast(e.response.data.toast)
            return
        }      
        props.getGroupInfo(props.groupId)
        props.setPanel('expenses')
    }

    const handleNumber = (event, type=null) => {
        const number = (Number(event.currentTarget.value)).toFixed(2)
        type === 'total' && setTotal(number)
        if(type === 'allocate') {
            const allocations = [...document.getElementsByClassName('allocations')].map(allocation => Number(allocation.value)).reduce((partial, amount) => partial + amount, 0).toFixed(2)
            setAllocated(allocations)
        }  
        event.currentTarget.value = number
    }

    return (
        <>
        <form>
            <div className='expense-form-container'>
                <p><b>Select expense type</b></p>
                <div className='icon-options'>                    
                    <label>
                        <input className='icon-option' type='radio' name='icon' value='food'/>
                        <img className='icon' src='https://cdn-icons-png.flaticon.com/512/8100/8100406.png' alt='food icon'/>
                    </label>
                    <label>
                        <input className='icon-option' type='radio' name='icon' value='entertainment'/>
                        <img className='icon' src='https://cdn-icons-png.flaticon.com/512/8100/8100406.png' alt='entertainment icon'/>
                    </label>
                    <label>
                        <input className='icon-option' type='radio' name='icon' value='transport'/>
                        <img className='icon' src='https://cdn-icons-png.flaticon.com/512/8100/8100406.png' alt='transport icon'/>
                    </label>
                    <label>
                        <input className='icon-option' type='radio' name='icon' value='food'/>
                        <img className='icon' src='https://cdn-icons-png.flaticon.com/512/8100/8100406.png' alt='other icon'/>
                    </label>
                </div>
                <label htmlFor='description'><b>Describe the expense</b></label>
                <input className='expense-inputs' type='text' name='description' placeholder='Enter a description' required/>
                <label htmlFor='total'><b>What was the total amount?</b></label>
                <span>$<input onBlur={e=>handleNumber(e, 'total')} className='expense-inputs' type='number' name='total' placeholder='0.00' required/></span>
                <label htmlFor='amount'><b>How much does each person owe?</b></label>
                {members && members.map(member => {
                    return (                        
                        <div className='expense-allocation'>
                            <p>{helper.capitaliseFirstLetter(member.username)}</p>
                            <input type='hidden' name='userId' value={member.user_id}/>
                            <span>$<input onBlur={e=>handleNumber(e, 'allocate')}className='expense-inputs allocations' type='number' name='amount' placeholder='$0.00'/></span>
                        </div>       
                    )
                })}
                {total && 
                    <div>
                        <div className='remainder'>
                            <p className='remainder-text'><span>${allocated}</span> of ${total} allocated</p>
                            {total === allocated && <img className='allocation-match' src='https://cdn-icons-png.flaticon.com/512/2550/2550322.png'/>}
                        </div>
                        <p className={Number(total) >= Number(allocated) ? 'remainder-text green': 'remainder-text red'}>${(total - allocated).toFixed(2)} {Number(total) >= Number(allocated) ? 'remaining' : 'over'}</p>
                    </div>
                }
                <button onClick={(e)=>{handleNewExpense(e)}}className={total === allocated ? 'expense-save match': 'expense-save'}>SAVE</button>
             </div>
        </form>       
        </>
    )
}
