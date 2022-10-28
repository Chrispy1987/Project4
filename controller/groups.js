// FOR ROUTE: '/groups'

const express = require('express');
const Groups = require('../models/groups');
const router = express.Router();

// Get groups that user is a member of
router.get('/member/:userId', async (request, response) => {
    const userId = request.params.userId;
    let dbRes;
    try {
        dbRes = await Groups.getGroupsUserIsIn(userId)
    } catch (e) {
        return response.status(501).json({ success: false, toast: 'Server error: cannot retrieve users groups [Groups.getGroupsUserIsIn]' })
    }
    if (dbRes.rowCount === 0) {
        return response.json({ success: true, groups: null })
    } else {
        const responseData = [];
        let responses
        try {
           responses = await Promise.all(dbRes.rows.map(row => Groups.getGroupData(row.group_id)))
        } catch (e) {
            return response.status(501).json({ success: false, toast: 'Server error: cannot retrieve group data [Groups.getGroupData]' })
        }
        responses.forEach(response => {
            responseData.push(response.rows[0])
        })
        return response.json({ success: true, groups: responseData })
    }
});

// Get members of specific group
router.get('/:groupId', async (request, response) => {
    const groupId = request.params.groupId;
    try {
        const dbRes = await Groups.getGroupMemberIds(groupId)
        if (dbRes.rowCount === 0) {
            return response.json({ success: true, members: null })
        } else {
            return response.json({ success: true, members: dbRes.rows })
        }
    } catch (e) {
        return response.status(501).json({ success: false, toast: 'Server error: cannot retrieve group data [Groups.getGroupsUserIsIn]' })
    }
});

// Delete group, providing user is the group owner
router.delete('/:groupId', async (request, response) => {
    const groupId = request.params.groupId;
    try {
        await Groups.deleteGroup(groupId)
        return response.json({ success: true, toast: 'Group deleted successfully!'})
    } catch (e) {
        return response.status(501).json({ success: false, toast: 'Failed to delete group [Groups.deleteGroup]' })
    }
});

// Handle new group creation
router.post('/new', async (request, response) => {
    const { name, groupId, ownerId } = request.body;
    if (!groupId) {
        console.log('Creating new group');
        let newGroupId;
        try {
            const dbRes = await Groups.createGroup(ownerId, name, groupId);
            newGroupId = dbRes.rows[0].group_id;
        } catch (e) {
            return response.status(501).json({ success: false, toast: 'Failed to create group [Groups.createGroup]' })
        }        
        try {            
            await Groups.assignMember(newGroupId, ownerId);
            return response.json({ success: true, groupId: newGroupId });
        } catch (e) {
            return response.status(501).json({ success: false, toast: 'Failed to assign member to group [Groups.assignMember]' })
        }
    } else {
        console.log('Updating existing group id: ', groupId);
        try {
            await Groups.updateGroupName(name, groupId);
            return response.json({ success: true })
        } catch (e) {
            return response.status(501).json({ success: false, toast: 'Failed to update group name [Groups.updateGroupName]' })
        }
    }
});

// Handle user invites to join groups
router.post('/invite', async (request, response) => {
    const { invitee, inviter, groupId } = request.body;
    const type = invitee.split('@').length > 1 ? 'email' : 'username';
    let dbRes;

    try {
        dbRes = await Groups.checkUserExists(type, invitee.toLowerCase())
    } catch (e) {
        return response.status(501).json({ success: false, toast: 'Failed to verify user [Groups.checkUserExists]' })
    }

    if (dbRes.rows.length === 0) {
        return response.status(404).json({ success: false, toast: `${type} does not exist` })
    } 

    const targetUser = dbRes.rows[0].user_id;
    if (targetUser === inviter) {
        return response.status(403).json({ success: false, toast: `You cannot invite yourself!` })
    }
    
    try {
        dbRes = await Groups.checkIfInviteExists(targetUser, groupId)
    } catch (e) {
        return response.status(501).json({ success: false, toast: 'Failed to verify invite [Groups.checkIfInviteExists]' })
    }
    if (dbRes.rows.length > 0) {
        return response.status(400).json({ success: false, toast: `User already has a pending invite to this group!` })
    }

    try {
        dbRes = await Groups.addInvite(targetUser, inviter, groupId)
        return response.json({ success: true, toast: `Invite successfully sent to ${invitee}` })
    } catch (e) {
        return response.status(501).json({ success: false, toast: 'Failed to invite user [Groups.inviteUser]' })
    }
});

// Get pending group invites
router.get('/invite/:userId', async (request, response) => {
    const userId = request.params.userId;
    let dbRes;
    try {
        dbRes = await Groups.getInvites(userId)   
    } catch (e) {
        return response.status(501).json({ success: false, toast: 'Server error: cannot retrieve invites [Groups.getInvites]' })
    }
    if (dbRes.rowCount === 0) {
        return response.json({ success: true, invites: null })
    } else {
        return response.json({ success: true, invites: dbRes.rows })
    }
});

// Declined invites
router.post('/invite/decline', async (request, response) => {
    const { userId, groupId } = request.body;
    try {
        await Groups.removeInvite(groupId, userId)
        return response.json({ success: true, toast: `Invite declined` })
    } catch (e) {
        return response.status(501).json({ success: false, toast: 'Server error: cannot decline invite [Groups.removeInvite]' })
    }
});

// Accepted invites
router.post('/invite/accept', async (request, response) => {
    const { userId, groupId } = request.body;
    try {
        await Groups.assignMember(groupId, userId) 
    } catch (e) {
        return response.status(501).json({ success: false, toast: 'Server error: cannot accept invite [Groups.acceptInvite]' })
    }
    try {
        await Groups.removeInvite(groupId, userId)
    } catch (e) {
        return response.status(501).json({ success: false, toast: 'Server error: cannot update invite table [Groups.removeInvite]' })
    }
    return response.json({ success: true, toast: `Invite accepted` })
});

// Handle viewing group and transactions
router.get('/view/:groupId', async (request, response) => {
    const groupId = request.params.groupId;
    let dbRes;
    try {
        dbRes = await Groups.getGroupData(groupId)
    } catch (e) {
        return response.status(501).json({ success: false, toast: 'Server error: issue getting group info [Groups.getGroupData]' })
    }
    
    let dbRes2;
    try {
        dbRes2 = await Groups.getExpenses(groupId)
    } catch (e) {
        return response.status(501).json({ success: false, toast: 'Server error: issue getting expenses [Groups.getExpenses]' })
    }
    
    const transactions = [...dbRes2.rows]
    try {       
        await Promise.all(dbRes2.rows.map( async (item, index) => {
            let dbRes3
            try {
                dbRes3 = await Groups.getTransactions(item.expense_id)
            } catch (e) {
                console.log('>> Getting Transactions Failed <<')
                return
            }
            transactions[index].transactions = [...dbRes3.rows]    
        }))
    } catch (e) {
        return response.status(501).json({ success: false, toast: 'Server error: issue getting transactions [Groups.getTransactions]' })
    }

    const groupData = {
        ...dbRes.rows[0],
        expenses: transactions
    }
    // console.log('$$$ GROUP DATA $$$', groupData)
    
    return response.json({ success: true, info: groupData })
});

// Handle adding new expense to group
router.post('/expense', async (request, response) => {
    const { creator, groupId, icon, description, total, users, allocations, date } = request.body;

    let dbRes;
    try {
        dbRes = await Groups.createExpense(creator, groupId, Number(total*100), date, icon, description)
    } catch (e) {
        console.log(e)
        return response.status(501).json({ success: false, toast: 'Server error: cannot create expense [Groups.createExpense]' })
    }

    const expenseId = dbRes.rows[0].expense_id;
    try {       
        await Promise.all(users.map( async (user, index) => {
            console.log('creator', creator)
            console.log('user', Number(user))
            try {
                if (Number(user) === creator) return
                await Groups.allocateBorrowers(expenseId, user, Number(allocations[index]*100))
            } catch (e) {
                console.log('ERROR - ALLOCATE BORROWERS', e)
                return
            }
        }))
    } catch (e) {
        return response.status(501).json({ success: false, toast: 'Server error: issue allocating borrowers [Groups.allocateBorrowers]' })
    }
    
    return response.json({ success: true, toast: 'Expense successfully created!' })
});

// Handle updating existing expense
router.patch('/expense', async (request, response) => {
    const { creator, expenseId, icon, description, total, users, allocations } = request.body;
    let dbRes;
    try {
        dbRes = await Groups.updateExpense(Number(total*100), icon, description, expenseId)
    } catch (e) {
        console.log(e)
        return response.status(501).json({ success: false, toast: 'Server error: failed to update expense [Groups.updateExpense]' })
    }

    try {       
        await Promise.all(users.map( async (userId, index) => {
            console.log('creator', creator)
            console.log('userId', Number(userId))
            try {
                if (userId === creator) return
                await Groups.updateBorrowers(expenseId, userId, Number(allocations[index]*100))
            } catch (e) {
                console.log('ERROR - ALLOCATE BORROWERS', e)
                return
            }
        }))
    } catch (e) {
        return response.status(501).json({ success: false, toast: 'Server error: issue update borrowers [Groups.updateBorrowers]' })
    }
    
    return response.json({ success: true, toast: 'Expense successfully updated!' })
});

// Handle deleting expense line
router.delete('/expense/:expenseId', async (request, response) => {
    const expenseId = request.params.expenseId;
    console.log('DELETING EXPENSE', expenseId)
    try {
        await Groups.deleteExpense(expenseId)
        return response.json({ success: true, toast: 'Expense deleted successfully!'})
    } catch (e) {
        return response.status(501).json({ success: false, toast: 'Failed to delete expense [Groups.deleteExpense]' })
    }
});


module.exports = router;