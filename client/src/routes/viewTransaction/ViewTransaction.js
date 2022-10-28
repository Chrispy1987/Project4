import './ViewTransaction.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { helper } from  '../../js/components/helper'

// PROPS PASSED INTO COMPONENT
{/* <ViewTransaction 
key = {`trans-${expense.expense_id}`}
expense={expense}
groupId = {groupInfo.group_id}
session = {props.session}
getGroupInfo = {getGroupInfo}
setPanel={setPanel}
assignIcon = {assignIcon}
handleToast = {props.handleToast}
/> */}

export const ViewTransaction = (props) => {
    const [total, setTotal] = useState(null)
    const [allocated, setAllocated] = useState(null)
    const [view, setView] = useState('receipt')

    useEffect(() => {
        const alreadyAllocated = props.expense.transactions.map(transaction => transaction.amount).reduce((partial, amount) => partial + amount, 0);
        const lendersAllocation = props.expense.amount - alreadyAllocated
        const totalAllocation = alreadyAllocated + lendersAllocation

        setTotal(props.expense.amount/100)
        setAllocated(totalAllocation/100)
    }, [])

    const calcOwingBalance = (userId) => {
        let balance;
        if (props.expense.lender_id === userId) {
            balance = helper.convertCentsToDollars(props.expense.amount - props.expense.transactions.map(transaction => transaction.amount).reduce((partial, amount) => partial + amount, 0))
        } else {
            balance = helper.convertCentsToDollars(props.expense.transactions.filter(transaction => transaction.user_id === userId)[0].amount)
        }
        // console.log('balance', balance)
        return balance
    }

    const handleUpdateExpense = async (event) => {
        event.preventDefault();

        if (allocated !== total) {
            props.handleToast('You must allocate the entire expense!')
            return
        }

        const formData = new FormData(event.target.form)

        const data = {
            creator: props.expense.lender_id,
            expenseId: props.expense.expense_id,
            icon: formData.get('icon'),
            description: formData.get('description'),
            total: formData.get('total'),
            users: formData.getAll('userId'),
            allocations: formData.getAll('amount'), 
        }

        if (!data.icon || !data.description || !data.total || !data.users || !data.allocations) {
            props.handleToast('Please complete all fields')
            return
        } 
        if (data.icon === null) {
            props.handleToast('Please select an expense type')
            return
        }
        
        try {
            const dbRes = await axios.patch('/groups/expense', data)
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

    const handleExpenseDeletion = async (expenseId) => {
        try {
            const dbRes = await axios.delete(`/groups/expense/${expenseId}`)
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

    return (
        <>
        {view === 'receipt' &&
        <div className='view-transaction fade-in'>
            <h4 className='receipt-heading receipt'>EXPENSE RECEIPT</h4>
            
            <div className='receipt-grouping'>
                <h4 className='receipt-heading'>Creation Date</h4>
                <p>{helper.getFullDate(props.expense.date)} by {helper.capitaliseFirstLetter(props.expense.lender)}</p>
            </div>
            <div className='receipt-grouping'>
                <h4 className='receipt-heading'>Receipt Description</h4>
                <p>{helper.capitaliseFirstLetter(props.expense.description)}</p>
            </div>
            <div className='receipt-grouping'>
                <h4 className='receipt-heading'>Receipt Total Cost</h4>
                <p>{helper.convertCentsToDollars(props.expense.amount)}</p>
            </div>

            <div className='receipt-grouping'>
                <h4 className='receipt-heading'>Receipt balances</h4>
                <p>You owe {calcOwingBalance(props.session)}</p>
                {props.expense.transactions.filter(transaction => transaction.user_id !== props.session).map(transaction => <p>{helper.capitaliseFirstLetter(transaction.borrower)} owes {calcOwingBalance(transaction.user_id)}</p>)}
                {props.expense.lender_id !== props.session && <p>{helper.capitaliseFirstLetter(props.expense.lender)} owes {calcOwingBalance(props.expense.lender_id)}</p>}
            </div>
            <div className='receipt-buttons'>
                <button onClick={()=> setView('edit')}>EDIT</button>
                <button onClick={()=> handleExpenseDeletion(props.expense.expense_id)}>DELETE</button>
            </div>
        </div>
        }
        {view === 'edit' &&
        <form>
            <div className='expense-form-container fade-in'>
                <h2 className='edit-header'>EDIT TRANSACTION</h2>
                <p className='expense-label'><b>Select expense type</b></p>
                <div className='icon-options'>                    
                    <label onMouseOver={e=>e.currentTarget.children[2].classList.replace('hide', 'reveal')} onMouseLeave={e=>e.currentTarget.children[2].classList.replace('reveal', 'hide')}>
                        <input className='icon-option' type='radio' name='icon' value='food' defaultChecked={props.expense.icon === 'food'}/>
                        <img className='icon' src={props.assignIcon('food')} alt='food icon'/>
                        <div className='hide'>Food & Drink</div>
                    </label>
                    <label onMouseOver={e=>e.currentTarget.children[2].classList.replace('hide', 'reveal')} onMouseLeave={e=>e.currentTarget.children[2].classList.replace('reveal', 'hide')}>
                        <input className='icon-option' type='radio' name='icon' value='entertainment' defaultChecked={props.expense.icon === 'entertainment'}/>
                        <img className='icon' src={props.assignIcon('entertainment')} alt='entertainment icon'/>
                        <div className='hide'>Entertainment</div>
                    </label>
                    <label onMouseOver={e=>e.currentTarget.children[2].classList.replace('hide', 'reveal')} onMouseLeave={e=>e.currentTarget.children[2].classList.replace('reveal', 'hide')}>
                        <input className='icon-option' type='radio' name='icon' value='transport' defaultChecked={props.expense.icon === 'transport'}/>
                        <img className='icon' src={props.assignIcon('transport')} alt='transport icon'/>
                        <div className='hide'>Transport</div>
                    </label>
                    <label onMouseOver={e=>e.currentTarget.children[2].classList.replace('hide', 'reveal')} onMouseLeave={e=>e.currentTarget.children[2].classList.replace('reveal', 'hide')}>
                        <input className='icon-option' type='radio' name='icon' value='other' defaultChecked={props.expense.icon === 'other'}/>
                        <img className='icon' src={props.assignIcon('other')} alt='other icon'/>
                        <div className='hide'>Other</div>
                    </label>
                </div>
                <div className='flex-col'>
                    <label htmlFor='description' className='expense-label'><b>Describe the expense</b></label>
                    <input className='expense-inputs expense-description' type='text' name='description' placeholder='Enter a description' defaultValue={props.expense.description} required/>
                </div>
                <div className='flex-col'>
                    <label htmlFor='total' className='expense-label'><b>What was the total amount?</b></label>
                    <span>$<input onBlur={e=>handleNumber(e, 'total')} className='expense-inputs' type='number' name='total' placeholder='0.00' defaultValue={(props.expense.amount/100).toFixed(2)} required/></span>
                </div>

                <label htmlFor='amount' className='expense-label'><b>How much does each person owe?</b></label>
                {props.expense.transactions.map((transaction, index) => {
                    return (
                        <>
                        {index === 0 &&
                            <div className='expense-allocation' key={props.expense.lender_id}>
                                <p className='expense-user'>{helper.capitaliseFirstLetter(props.expense.lender)}</p>
                                <input type='hidden' name='userId' value={props.expense.lender_id}/>
                                <span>$<input onBlur={e=>handleNumber(e, 'allocate')}className='expense-inputs allocations' type='number' name='amount' placeholder='0.00' defaultValue={((props.expense.amount - props.expense.transactions.map(transaction => transaction.amount).reduce((partial, amount) => partial + amount))/100).toFixed(2)} /></span>
                            </div>
                        }                                   
                        {index >= 0 &&           
                        <div className='expense-allocation' key={transaction.user_id}>
                            <p className='expense-user'>{helper.capitaliseFirstLetter(transaction.borrower)}</p>
                            <input type='hidden' name='userId' value={transaction.user_id}/>
                            <span>$<input onBlur={e=>handleNumber(e, 'allocate')}className='expense-inputs allocations' type='number' name='amount' placeholder='0.00' defaultValue={(transaction.amount/100).toFixed(2)} /></span>
                        </div>
                        }
                        </>
                    )
                })}
                    <>
                        <div className='remainder'>
                            <p className='remainder-text'><span>${allocated}</span> of ${total} allocated</p>
                            {total === allocated && <img className='allocation-match' src='https://cdn-icons-png.flaticon.com/512/2550/2550322.png'/>}
                        </div>
                        <b><p className={Number(total) >= Number(allocated) ? 'remainder-text green': 'remainder-text red'}>${(total - allocated).toFixed(2)} {Number(total) >= Number(allocated) ? 'remaining' : 'over'}</p></b>
                        <button onClick={(e)=>{handleUpdateExpense(e)}}className={total === allocated ? 'expense-save match': 'expense-save'}>UPDATE</button>
                    </>                    
             </div>
        </form>  
        }     
        </>
    )
}
