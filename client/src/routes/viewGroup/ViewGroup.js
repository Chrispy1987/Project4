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

    return (
        <>
            {groupInfo && 
            <>
                <ul id='REFERENCE_ONLY_DELETE_LATER'>
                    <li>GROUP OWNER: {helper.capitaliseFirstLetter(groupInfo.owner)}</li>
                    <li>GROUP NAME: {groupInfo.name}</li>
                    <li>STATUS: {groupInfo.settled ? 'This group has been settled' : 'Not settled'}</li>
                </ul>
                <h2>{groupInfo.name}</h2>
                {groupInfo && <button onClick={()=>{}}> + New Expense</button>}
                {groupInfo ? groupInfo.expenses.map((expense) => {
                    return (
                        // <Expenses />   Set up new componenet to handle below
                        <div className='expense-line'>
                            <b>---Expense lines here---</b>
                            <ul id='REFERENCE_ONLY_DELETE_LATER'>
                                <li>AMOUNT: {expense.amount}</li>
                                <li>DATE: {expense.date}</li>
                                <li>ICON: {expense.icon}</li>
                                <li>DESCRIPTION: {expense.description}</li>
                            </ul>
                            {expense.transactions.map(transaction => {
                                return (
                                    <div>
                                        <b>---Transaction lines here---</b>
                                        <ul id='REFERENCE_ONLY_DELETE_LATER'>
                                            <li>BORROWER {transaction.borrower}</li>
                                            <li>AMOUNT ALLOCATED {transaction.amount}</li>
                                        </ul>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })
                : <div>
                    <p>No expenses have been recorded for this group</p>
                    <button onClick={()=>{}}>ADD EXPENSE</button>
                    </div>
                }
            </>
            }
        </>
    )
}