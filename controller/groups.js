// FOR ROUTE: '/user/groups'

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
            // throw new Error('Unable to create group', e);
            return response.status(501).json({ success: false, toast: 'Failed to create group [Groups.createGroup]' })
        }
        
        try {            
            await Groups.assignMember(newGroupId, ownerId);
            return response.json({ success: true, groupId: newGroupId });
        } catch (e) {
            // throw new Error('Unable to assign members', e);
            return response.status(501).json({ success: false, toast: 'Failed to assign member to group [Groups.assignMember]' })
        }
    } else {
        console.log('Updating existing group id: ', groupId);
        try {
            await Groups.updateGroupName(name, groupId);
            return response.json({ success: true })
        } catch (e) {
            // throw new Error('Unable to update group', e)
            return response.status(501).json({ success: false, toast: 'Failed to update group name [Groups.updateGroupName]' })

        }
    }
})

// Handle user invites to join groups
router.post('/invite', async (request, response) => {
    const { name, newGroup } = request.body;
    const checkIfEmail = name.split('@').length > 1 ? true : false;
    if (checkIfEmail) { 
        try {
            await Groups.inviteUser('')
        } catch (e) {
            throw new Error('issue inviting user')
        }
    }
});

module.exports = router;