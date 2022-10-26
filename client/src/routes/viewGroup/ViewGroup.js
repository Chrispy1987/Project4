import './ViewGroup.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { helper } from '../../js/components/helper'

{/* PROPS PASSED INTO COMPONENT:
    <ViewGroup
        groupId={groupNumber}
        session={props.session}
        handleToast={props.handleToast}
        triggerGroup={triggerGroup}
        setTriggerGroup={setTriggerGroup}
/> */}

export const ViewGroup = (props) => {

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
        console.log(data)
        setGroupInfo(data)
    }
    console.log(groupInfo)
    return (
        <>  
            {groupInfo && 
            <>
                {/* <ul id='REFERENCE_ONLY_DELETE_LATER'>
                    <li>GROUP OWNER: {helper.capitaliseFirstLetter(groupInfo.owner)}</li>
                    <li>GROUP NAME: {groupInfo.name}</li>
                    <li>STATUS: {groupInfo.settled ? 'This group has been settled' : 'Not settled'}</li>
                </ul> */}
                <h2 id='group-name' className='grid-header'>{groupInfo.name}</h2>
                {groupInfo.expenses.length === 0 && 
                    <>
                        <p><i>"The secret of getting ahead is getting started" ~ Mark Twain</i></p>
                    </>
                }
                <button className='float-button-right' onClick={()=>{}}> + New Expense</button>
                {groupInfo && groupInfo.expenses.map((expense) => {
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
                        // <Expenses />   Set up new componenet to handle below
                        <>
                            <div className='expense-line'>
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
                           


                            {/* <b>----------Expense lines here----------</b> */}
                            {/* <ul id='REFERENCE_ONLY_DELETE_LATER'>
                                <li>LENDER: {expense.lender} - userId {expense.lender_id}</li>
                                <li>AMOUNT: {expense.amount}</li>
                                <li>DATE: {expense.date}</li>
                                <li>ICON: {expense.icon}</li>
                                <li>DESCRIPTION: {expense.description}</li>
                            </ul> */}
                            {expense.transactions.map(transaction => {
                                return (
                                    <div>
                                        {/* <b>**Transaction lines here**</b> */}
                                        {/* on expense click -  */}
                                        {/* <ul id='REFERENCE_ONLY_DELETE_LATER'>
                                            <li>BORROWER {transaction.borrower} - userId {transaction.user_id}</li>
                                            <li>OWES {transaction.amount}</li>
                                        </ul> */}
                                    </div>
                                )
                            })}
                        </>
                    )
                })}
            </>
            }
        </>
    )
}