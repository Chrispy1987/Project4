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
    const [allocated, setAllocated] = useState(null)
    const [step, setStep] = useState(0)

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

        if (!data.icon || !data.description || !data.total || !data.users || !data.allocations) {
            props.handleToast('Please complete all fields')
            return
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
            <div className='expense-form-container fade-in'>
                <p className='expense-label'><b>Select expense type</b></p>
                <div className='icon-options'>                    
                    <label onMouseOver={e=>e.currentTarget.children[2].classList.replace('hide', 'reveal')} onMouseLeave={e=>e.currentTarget.children[2].classList.replace('reveal', 'hide')} onClick={()=>{!step && setStep(1)}}>
                        <input className='icon-option' type='radio' name='icon' value='food'/>
                        <img className='icon' src='https://cdn-icons-png.flaticon.com/512/737/737967.png' alt='food icon'/>
                        <div className='hide'>Food & Drink</div>
                    </label>
                    <label onMouseOver={e=>e.currentTarget.children[2].classList.replace('hide', 'reveal')} onMouseLeave={e=>e.currentTarget.children[2].classList.replace('reveal', 'hide')} onClick={()=>{!step && setStep(1)}}>
                        <input className='icon-option' type='radio' name='icon' value='entertainment'/>
                        <img className='icon' src='https://cdn-icons-png.flaticon.com/512/864/864763.png' alt='entertainment icon'/>
                        <div className='hide'>Entertainment</div>
                    </label>
                    <label onMouseOver={e=>e.currentTarget.children[2].classList.replace('hide', 'reveal')} onMouseLeave={e=>e.currentTarget.children[2].classList.replace('reveal', 'hide')} onClick={()=>{!step && setStep(1)}}>
                        <input className='icon-option' type='radio' name='icon' value='transport'/>
                        <img className='icon' src='https://cdn-icons-png.flaticon.com/512/995/995260.png' alt='transport icon'/>
                        <div className='hide'>Transport</div>
                    </label>
                    <label onMouseOver={e=>e.currentTarget.children[2].classList.replace('hide', 'reveal')} onMouseLeave={e=>e.currentTarget.children[2].classList.replace('reveal', 'hide')} onClick={()=>{!step && setStep(1)}}>
                        <input className='icon-option' type='radio' name='icon' value='other'/>
                        <img className='icon' src='https://cdn-icons-png.flaticon.com/512/2521/2521963.png' alt='other icon'/>
                        <div className='hide'>Other</div>
                    </label>
                </div>
                <>
                {step >= 1 &&
                <div className='flex-col fade-in'>
                    <label htmlFor='description' className='expense-label'><b>Describe the expense</b></label>
                    <input onChange={()=>step < 2 && setStep(2)} className='expense-inputs expense-description' type='text' name='description' placeholder='Enter a description' required/>
                </div>
                }
                </>
                <>
                {step >=2 &&
                <div className='flex-col fade-in'>
                    <label htmlFor='total' className='expense-label'><b>What was the total amount?</b></label>
                    <span>$<input onChange={()=>step < 3 && setStep(3)} onBlur={e=>handleNumber(e, 'total')} className='expense-inputs' type='number' name='total' placeholder='0.00' required/></span>
                </div>
                }
                </>

                {step >=3 && <label htmlFor='amount' className='expense-label fade-in'><b>How much does each person owe?</b></label>}
                {step >= 3 && members && members.map(member => {                    
                    return (
                        <>                                                
                        <div className='expense-allocation fade-in'>
                            <p className='expense-user'>{helper.capitaliseFirstLetter(member.username)}</p>
                            <input type='hidden' name='userId' value={member.user_id}/>
                            <span>$<input onChange={()=>{step < 4 && setStep(4)}} onBlur={e=>handleNumber(e, 'allocate')}className='expense-inputs allocations' type='number' name='amount' placeholder='0.00'/></span>
                        </div>
                        </>   
                    )
                })}
                {step >= 4 && 
                    <>
                        <div className='remainder fade-in'>
                            <p className='remainder-text'><span>${allocated}</span> of ${total} allocated</p>
                            {total === allocated && <img className='allocation-match fade-in' src='https://cdn-icons-png.flaticon.com/512/2550/2550322.png'/>}
                        </div>
                        <b><p className={Number(total) >= Number(allocated) ? 'remainder-text green fade-in': 'remainder-text red fade-in'}>${(total - allocated).toFixed(2)} {Number(total) >= Number(allocated) ? 'remaining' : 'over'}</p></b>
                        <button onClick={(e)=>{handleNewExpense(e)}}className={total === allocated ? 'expense-save match fade-in': 'expense-save fade-in'}>SAVE</button>
                    </>                    
                }                
             </div>
        </form>       
        </>
    )
}
