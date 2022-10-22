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
  deleteGroup: (groupId) => {
    const sql = `
      DELETE FROM groups 
      WHERE group_id=$1
      `
    return db.query(sql, [groupId])
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
  assignMember: (groupId, userId) => {
    const sql = `
      INSERT INTO members(group_id, user_id)
      VALUES($1, $2)
      `
    return db.query(sql, [groupId, userId])
  },
  updateGroupName: (name, groupId) => {
    const sql=`      
      UPDATE groups SET name = $1 
      WHERE group_id = $2
      `
    return db.query(sql, [name, groupId])
  }
}

module.exports = Groups;
