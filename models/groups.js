const db = require("../database/db");

const Groups = {
  getGroupsUserIsIn: (userId) => {
    const sql = 'SELECT group_id FROM members WHERE user_id=$1'
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
    const sql = 'DELETE FROM groups WHERE group_id=$1'
    return db.query(sql, [groupId])
  }
  // getGroupData: (groupId) => {
  //   console.log('get group data', groupId)
  //   const sql = `
  //   SELECT groups.group_id, groups.user_id AS owner_id, groups.name, groups.settled, expense.user_id AS payer, expense.expense_id, expense.amount AS total_amount, expense.date, expense.icon, expense.description, borrower.user_id AS borrower_id, borrower.amount AS borrower_portion
  //   FROM groups
  //   INNER JOIN expense ON groups.group_id = expense.group_id
  //   INNER JOIN borrower ON expense.expense_id = borrower.expense_id    
  //   WHERE groups.group_id=$1
  //   `
  //   return db.query(sql, [groupId])
  //     .then(dbRes => dbRes)
  // },
}

module.exports = Groups;
