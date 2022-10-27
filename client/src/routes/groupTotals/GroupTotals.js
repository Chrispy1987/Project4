import './GroupTotals.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { helper } from  '../../js/components/helper'

// PROPS PASSED INTO COMPONENT
{/* <GroupTotals
expenses={groupInfo.expenses}
session={props.session}
handleToast={props.handleToast}
/> */}

export const GroupTotals = (props) => {

    const [wallet, setWallet] = useState(null)

    useEffect(()=> {
        constructWallet(props.expenses)   
    }, [])

    const constructWallet = (expenses) => {
        const data = {};

        expenses.map(expense => {
            const lender = expense.lender;
            if (Object.keys(data).includes(lender)) {
                // user key exists, add to existing accruals
                data[lender].paid += expense.amount;
                expense.transactions.map(transaction=> data[lender].borrowers[transaction.borrower] += transaction.amount);
            } else {
                // create key and setup structure
                data[lender] = {
                    'userId': expense.lender_id,
                    'paid': expense.amount,
                    'borrowers': {}
                }
                expense.transactions.map(transaction=> {
                    data[lender].borrowers = {
                        ...data[lender].borrowers,
                        [transaction.borrower] : transaction.amount}
                })             
            }
        });
        console.log(data)
        setWallet(data)
        console.log(Object.keys(data))
    }

    return (
        <div className='group-totals-container fade-in'>
            {wallet && Object.keys(wallet).map(member => {
                const totalPaid = wallet[member].paid;
                const amountOwing = Object.keys(wallet[member].borrowers).map(borrower => wallet[member].borrowers[borrower]).reduce((partial, amount) => partial + amount, 0);
                const ownPortion = totalPaid - amountOwing;
                return (
                    <>
                        <p>-----------------------</p>
                        <p>MEMBER NAME: {member}</p>
                        <p>TOTAL PAID: {helper.convertCentsToDollars(totalPaid)}</p>
                        <p>OWN PORTION: {helper.convertCentsToDollars(ownPortion)} </p>
                        <p>COLLECTIVE AMOUNT OWING: {helper.convertCentsToDollars(amountOwing)}</p>
                        <p>-----------------------</p>
                    </>                    
                )
            })}
        </div>
    )
}