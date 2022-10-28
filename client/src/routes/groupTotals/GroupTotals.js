import './GroupTotals.css'
import { useState, useEffect } from 'react'
import { helper } from  '../../js/components/helper'

// PROPS PASSED INTO COMPONENT
{/* <GroupTotals
expenses={groupInfo.expenses}
session={props.session}
/> */}

export const GroupTotals = (props) => {

    // console.log('EXPENSE PROP', props.expenses)
    const [wallet, setWallet] = useState(null)
    useEffect(()=> {
        constructWallet(props.expenses)   
    }, [props.expenses])

    const constructWallet = (expenses) => {
        const data = {};

        expenses.forEach(expense => {
            const expenseLenderName = expense.lender;            
            // if lender does not exist, setup object structure
            if (!data[expenseLenderName]) {
                data[expenseLenderName] = {
                    'userId': expense.lender_id,
                    'paid': 0,
                    'borrowers': {},
                    'liabilities': {}
                }
            }
            // update total amount paid by lender
            data[expenseLenderName].paid += expense.amount;

            // update users that borrowed from lender
            expense.transactions.forEach(transaction => {
                data[expenseLenderName].borrowers[transaction.borrower] = data[expenseLenderName].borrowers[transaction.borrower] ?? 0;
                data[expenseLenderName].borrowers[transaction.borrower] += transaction.amount;

                // update liabilities (money you owe others)
                data[transaction.borrower] = data[transaction.borrower] ?? {
                    'userId': transaction.user_id,
                    'paid': 0,
                    'borrowers': {},
                    'liabilities': {}
                };
                data[transaction.borrower].liabilities[expenseLenderName] = data[transaction.borrower].liabilities[expenseLenderName] ?? 0;
                data[transaction.borrower].liabilities[expenseLenderName] += transaction.amount;
            });

            // Loop through liabilities to ensure that keys were created in the borrowers field (in case user has not created an expense)
            Object.keys(data).map(memberName => 
                Object.keys(data[memberName].liabilities).map(liabilityName => data[memberName].borrowers[liabilityName] = data[memberName].borrowers[liabilityName] ?? 0));

        });

        // update wallet
        setWallet(data)
    }

    return (
        <div className='group-totals-container fade-in'>
            {wallet && Object.keys(wallet).filter(memberName => wallet[memberName].userId == props.session).map(memberName => {
            // {wallet && Object.keys(wallet).map(memberName => {
                const totalPaid = wallet[memberName].paid;
                return (
                    <ul className='group-totals'>
                        {/* <li><span>Report for</span> {memberName}</li> */}
                        <li><span>You've Paid:</span> {helper.convertCentsToDollars(totalPaid)}</li>
                        {Object.keys(wallet[memberName].borrowers).map(borrowerName=> { 
                            const loan = wallet[memberName].borrowers[borrowerName] || 0
                            const liabilities = wallet[memberName].liabilities[borrowerName] || 0
                            const loanLessLiabilities = loan - liabilities || loan;
                            // console.log(borrowerName, 'owes', memberName, wallet[memberName].borrowers[borrowerName])
                            // console.log(memberName, 'owes', borrowerName, wallet[memberName].liabilities[borrowerName])
                            // console.log('DIFFERENCE', loanLessLiabilities)
                            const borrowerNameCapped = helper.capitaliseFirstLetter(borrowerName)
                            const message = loanLessLiabilities === 0 ? `${borrowerNameCapped} - settled` : (loanLessLiabilities < 0 ? `You owe ${borrowerNameCapped}` : `${borrowerNameCapped} owes you`)
                            return (
                                <li>
                                    <span>{message}</span>
                                    <span className={loanLessLiabilities === 0 ? 'orange' : (loanLessLiabilities < 0 ? 'red' : 'green') }>{helper.convertCentsToDollars(Math.abs(loanLessLiabilities))}</span>
                                </li>
                            )
                        })}
                    </ul>                    
                )
            })}
        </div>
    )
}