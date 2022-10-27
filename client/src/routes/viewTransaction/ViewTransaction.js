import './ViewTransaction.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { helper } from  '../../js/components/helper'

// PROPS PASSED INTO COMPONENT
// <ViewTransaction 
// key = {`trans-${expense.expense_id}`}
// expense = {expense}
// session = {props.session}
// />

export const ViewTransaction = (props) => {
    const [transactions, setTransactions] = useState(props.expense)

    useEffect(()=> {
        console.log('TRANS', transactions)
    }, [])

    const calcOwingBalance = (userId) => {
        let balance;
        if (props.expense.lender_id === userId) {
            console.log('match', props.expense.lender_id, userId)
            balance = helper.convertCentsToDollars(props.expense.amount - props.expense.transactions.map(transaction => transaction.amount).reduce((partial, amount) => partial + amount, 0))
            console.log('balance inner', balance)
        } else {
            console.log('NO MATCH', props.expense.lender_id, userId)
            balance = helper.convertCentsToDollars(props.expense.transactions.filter(transaction => transaction.user_id === userId)[0].amount)
        }
        console.log('balance', balance)
        return balance
    }

    return (
        <div className='fade-in'>
            <p>VIEWING TRANSACTION DEETS</p>
            <p>Ability to edit? Add visual icon somewhere?</p>
            <p>{helper.capitaliseFirstLetter(props.expense.description)}</p>
            <p>{helper.convertCentsToDollars(props.expense.amount)}</p>
            <p>Added by {props.expense.lender_id === props.session ? 'you': helper.capitaliseFirstLetter(props.expense.lender)} on {props.expense.date}</p>
            <p>You owe {calcOwingBalance(props.session)}</p>
            {props.expense.transactions.filter(transaction => transaction.user_id !== props.session).map(transaction => <p>{helper.capitaliseFirstLetter(transaction.borrower)} owes {calcOwingBalance(transaction.user_id)}</p>)}
            {props.expense.lender_id !== props.session && <p>{helper.capitaliseFirstLetter(props.expense.lender)} owes {calcOwingBalance(props.expense.lender_id)}</p>}
        </div>
    )
}
