// FOR ROUTE: '/user/groups'

const express = require('express');
const Groups = require('../models/groups');
const router = express.Router();

// Get groups that user is a member of
router.get('/member/:userId', (request, response) => {
    const userId = request.params.userId;

    Groups.getGroupsUserIsIn(userId)
        .then(dbRes => {
            if (dbRes.rowCount === 0) {
                return response.json({ success: true, groups: null })
            } else {
                const responseData = [];
                Promise.all(dbRes.rows.map(row => Groups.getGroupData(row.group_id)))
                    .then(responses => {
                        responses.forEach(response => {
                            responseData.push(response.rows[0])
                        })
                        return response.json({ success: true, groups: responseData })
                    })
                    .catch(() => console.log('Issue getting group data'))
            }
        })
        .catch(() => {
            return response.status(501).json({ success: false, toast: 'Server error: cannot retrieve group data [Groups.getGroupsUserIsIn]' })
        });
});

// Get members of specific group
router.get('/:groupId', (request, response) => {
    const groupId = request.params.groupId;
    Groups.getGroupMemberIds(groupId)
        .then(dbRes => {
            if (dbRes.rowCount === 0) {
                return response.json({ success: true, members: null })
            } else {
                return response.json({ success: true, members: dbRes.rows })
            }
        })
        .catch(() => {
            return response.status(501).json({ success: false, toast: 'Server error: cannot retrieve group data [Groups.getGroupsUserIsIn]' })
        });
});

// Delete group, providing user is the group owner
router.delete('/:groupId', (request, response) => {
    const groupId = request.params.groupId;
    Groups.deleteGroup(groupId)
        .then(() => {
            return response.json({ success: true, toast: 'Group deleted successfully!'})
        })
});

module.exports = router;