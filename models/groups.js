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
      SELECT invites.group_id, users.username AS inviter, groups.name
      FROM invites
      INNER JOIN users ON users.user_id = invites.inviter
      INNER JOIN groups ON groups.group_id = invites.group_id
      WHERE invites.user_id = $1
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
  },
  getExpenses: (groupId) => {
    const sql = `
      SELECT users.username AS lender, expense.user_id AS lender_id, expense.expense_id, expense.amount, expense.date, expense.icon, expense.description
      FROM expense
      INNER JOIN users ON users.user_id = expense.user_id
      WHERE group_id=$1
      ORDER BY date DESC, expense_id DESC
      `
    return db.query(sql, [groupId])
  },
  getTransactions: (expenseId) => {
    const sql = `
      SELECT borrower.user_id, borrower.amount, users.username AS borrower
      FROM borrower
      INNER JOIN users ON users.user_id = borrower.user_id
      WHERE expense_id=$1
      `
    return db.query(sql, [expenseId])
  },
  createExpense: (creator, groupId, total, date, icon, description) => {
    const sql = `
    INSERT INTO expense(group_id, user_id, amount, date, icon, description)
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING expense_id
    `
  return db.query(sql, [groupId, creator, total, date, icon, description])
  },
  updateExpense: (total, icon, description, expenseId) => {
    const sql = `
    UPDATE expense 
    SET amount=$1, icon=$2, description=$3
    WHERE expense_id=$4
    `
  return db.query(sql, [total, icon, description, expenseId])
  },
  deleteExpense: (expenseId) => {
    const sql = `
      DELETE FROM expense 
      WHERE expense_id=$1
      `
    return db.query(sql, [expenseId])
  },
  allocateBorrowers: (expenseId, user, amount) => {
    const sql = `
    INSERT INTO borrower(expense_id, user_id, amount)
    VALUES($1, $2, $3)
    `
  return db.query(sql, [expenseId, user, amount])
  },
  updateBorrowers: (amount, expenseId, userId) => {
    console.log('AMOUNT', amount)
    console.log('EXPENSE ID', expenseId)
    console.log('USER ID', userId)
    const sql = `
    UPDATE borrower 
    SET amount=$1
    WHERE expense_id=$2 AND user_id=$3
    `
  return db.query(sql, [amount, expenseId, userId])
  }
}

module.exports = Groups;
