const db = require("../database/db");

const Groups = {
  getGroupsUserIsIn: (userId) => {
    const sql = `
      SELECT group_id 
      FROM members 
      WHERE user_id=$1
      `
    return db.query(sql, [userId])
      .then(dbRes => dbRes)
  },
  getGroupData: (groupId) => {
    const sql = `
      SELECT groups.group_id, users.username AS owner, groups.user_id AS owner_id, groups.name, groups.settled 
      FROM groups 
      INNER JOIN users ON groups.user_id = users.user_id
      WHERE groups.group_id=$1
      `
    return db.query(sql, [groupId])
      .then(dbRes => dbRes)
  },
  getGroupMemberIds: (groupId) => {
      const sql = `
      SELECT members.user_id, users.username
      FROM members 
      INNER JOIN users ON members.user_id = users.user_id
      WHERE group_id=$1      
      `
      return db.query(sql, [groupId])
        .then(dbRes => dbRes)
  },
  createGroup: (ownerId, name, groupId) => {
    const sql = `       
      INSERT INTO groups(user_id, name, settled)
      VALUES($1, $2, null)
      RETURNING group_id
      `
      return db.query(sql, [ownerId, name])
        .then(dbRes => dbRes)    
  },
  deleteGroup: (groupId) => {
    const sql = `
      DELETE FROM groups 
      WHERE group_id=$1
      `
    return db.query(sql, [groupId])
  }, 
  assignMember: (groupId, userId) => {
    const sql = `
      INSERT INTO members(group_id, user_id)
      VALUES($1, $2)
      `
    return db.query(sql, [groupId, userId])
  },
  updateGroupName: (name, groupId) => {
    const sql = `      
      UPDATE groups SET name = $1 
      WHERE group_id = $2
      `
    return db.query(sql, [name, groupId])
  },
  checkUserExists: (type, invitee) => {
    if (type === 'email') {
      const sql = `
        SELECT user_id 
        FROM users
        WHERE email=$1
        `
        return db.query(sql, [invitee])
        .then(dbRes => dbRes)
    } else if (type === 'username') {
      const sql = `
        SELECT user_id 
        FROM users
        WHERE username=$1
        `
        return db.query(sql, [invitee])
        .then(dbRes => dbRes)
    }
  },
  checkIfInviteExists: (targetUser, groupId) => {
    const sql = `
      SELECT * 
      FROM invites
      WHERE user_id=$1 AND group_id=$2
      `
    return db.query(sql, [targetUser, groupId])
    .then(dbRes => dbRes)
  },
  addInvite: (targetUser, inviter, groupId) => {
    const sql = `
      INSERT INTO invites(group_id, user_id, inviter)
      VALUES($1, $2, $3)
      RETURNING invite_id
      `
    return db.query(sql, [groupId, targetUser, inviter])
    .then(dbRes => dbRes)
  },
  getInvites: (userId) => {
    const sql = `
      SELECT * 
      FROM invites
      WHERE user_id = $1
      `
    return db.query(sql, [userId])
    .then(dbRes => dbRes)
  },
  removeInvite: (groupId, userId) => {
    const sql = `
      DELETE 
      FROM invites
      WHERE group_id=$1
      AND user_id=$2
      `
      return db.query(sql, [groupId, userId])
  }
}

module.exports = Groups;
