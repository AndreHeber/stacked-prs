// PR #2: User Model
// This PR adds the User model that uses the database schema from PR #1

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.join(__dirname, '../auth.db');

class User {
  constructor(id, email, passwordHash, createdAt) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt;
  }

  static async create(email, password) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);
      const passwordHash = bcrypt.hashSync(password, 10);

      db.run(
        'INSERT INTO users (email, password_hash) VALUES (?, ?)',
        [email, passwordHash],
        function(err) {
          if (err) {
            db.close();
            reject(err);
            return;
          }
          db.get(
            'SELECT * FROM users WHERE id = ?',
            [this.lastID],
            (err, row) => {
              db.close();
              if (err) {
                reject(err);
                return;
              }
              resolve(new User(row.id, row.email, row.password_hash, row.created_at));
            }
          );
        }
      );
    });
  }

  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);
      db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, row) => {
          db.close();
          if (err) {
            reject(err);
            return;
          }
          if (!row) {
            resolve(null);
            return;
          }
          resolve(new User(row.id, row.email, row.password_hash, row.created_at));
        }
      );
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath);
      db.get(
        'SELECT * FROM users WHERE id = ?',
        [id],
        (err, row) => {
          db.close();
          if (err) {
            reject(err);
            return;
          }
          if (!row) {
            resolve(null);
            return;
          }
          resolve(new User(row.id, row.email, row.password_hash, row.created_at));
        }
      );
    });
  }

  verifyPassword(password) {
    return bcrypt.compareSync(password, this.passwordHash);
  }
}

module.exports = User;
