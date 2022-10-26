import './ViewGroup.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { helper } from '../../js/components/helper'
import { NewExpense } from '../newExpense/NewExpense'
import { ViewTransaction } from '../viewTransaction/ViewTransaction'

{/* PROPS PASSED INTO COMPONENT:
    <ViewGroup
        groupId={groupNumber}
        session={props.session}
        handleToast={props.handleToast}
        triggerGroup={triggerGroup}
        setTriggerGroup={setTriggerGroup}
/> */}

export const ViewGroup = (props) => {

    const [panel, setPanel] = useState('expenses')
    const [expense, setExpense] = useState(null)
    const [groupInfo, setGroupInfo] = useState(null)

    useEffect(() => {
        getGroupInfo(props.groupId)
    }, []);

    const getGroupInfo = async (groupId) => {
        let dbRes;        
        try {
            dbRes = await axios(`/groups/view/${groupId}`)
        } catch (e) {
            e.response.status === 500 
                ? props.handleToast('We are having trouble retrieving group info. Please try again later!')
                : props.handleToast(e.response.data.toast)
                return
        }
        const data = dbRes.data.info;
        setGroupInfo(data)
    }

    return (
        <>  
            {groupInfo &&
            <>
                <div className='header-flex'>
                    <h2 id='group-name' className='grid-header'>{groupInfo.name}</h2>
                    {groupInfo.expenses.length === 0 && 
                        <p><i>"The secret of getting ahead is getting started" ~ Mark Twain</i></p>}
                    {panel === 'expenses' && 
                    <div>
                        <button className='action-button' onClick={()=>{setPanel('new')}}> + New Expense</button>
                        <button className='action-button back' onClick={()=>{props.setPanel('groups')}}>Go Back</button>   
                    </div> 
                    }                
                {panel !== 'expenses' && <button className='action-button back' onClick={()=>{setPanel('expenses')}}> Go Back</button>}
                </div>

                {panel === 'expenses' && groupInfo.expenses.map((expense) => {
                    const lender = helper.capitaliseFirstLetter(expense.lender)
                    const amountPaid = helper.convertCentsToDollars(expense.amount);
                    const description = helper.capitaliseFirstLetter(expense.description);
                    
                    let userPortion;
                    let isLender;
                    if (expense.lender_id === props.session) {
                        isLender = true;
                        userPortion = helper.convertCentsToDollars(expense.transactions.map(transaction => transaction.amount).reduce((partial, amount) => partial + amount, 0));
                    } else {
                        isLender = false;
                        userPortion = helper.convertCentsToDollars(expense.transactions.filter(transaction => transaction.user_id === props.session).map(get => get.amount));
                    }

                    return (
                        <>
                            <div className='expense-line' onClick={()=>{
                                setExpense(expense)
                                setPanel('transactions')
                                }}> 
                                <div className='container-date'>
                                    {/* <p>{expense.date}</p> */}
                                    <p className='date-day'>12</p>
                                    <p className='date-month'>OCT</p>
                                </div>
                                <div className='container-icon'>
                                    <img className='icon' src='https://cdn-icons-png.flaticon.com/512/8100/8100406.png'/>
                                </div>
                                <div className='container-description'>
                                    <p className='description'>{description}</p>
                                    <p className='amount-paid'>{isLender ? 'You paid' : `${lender} paid`} {amountPaid}</p>
                                </div>
                                <div className='container-lent'>
                                    <p className={isLender ? 'user-lender green' : 'user-lender red'}>{isLender ? 'You lent' : 'You borrowed'}</p>
                                    <p className={isLender ? 'user-portion green' : 'user-portion red'}>{userPortion}</p>
                                </div>
                            </div>
                        </>
                    )
                })}
                {panel === 'new' &&
                    <>
                        <NewExpense 
                            groupId = {groupInfo.group_id}
                            session = {props.session}
                            handleToast = {props.handleToast}
                            triggerGroup= {props.triggerGroup}
                            setTriggerGroup= {props.setTriggerGroup}
                        />
                    </>
                }
                {panel === 'transactions' &&
                <>
                    <ViewTransaction 
                        key = {`trans-${expense.expense_id}`}
                        expense = {expense}
                        groupId = {groupInfo.group_id}
                        session = {props.session}
                    />
                </>
                }
            </>
            }
        </>
    )
}