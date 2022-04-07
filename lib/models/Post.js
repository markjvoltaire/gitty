const pool = require('../utils/pool');

module.exports = class Posts {
  id;
  userposts;

  constructor(row) {
    this.id = row.id;
    this.userposts = row.userposts;
  }

  static createPost({ userposts }) {
    return pool
      .query(
        `
        INSERT INTO
        posts (userposts)
        VALUES
        ($1)
        RETURNING
        *
        `,
        [userposts]
      )
      .then(({ rows }) => new Posts(rows[0]));
  }

  static async getAllPosts() {
    const { rows } = await pool.query(
      `
    SELECT
    *
    FROM
    posts`
    );
    return rows.map((row) => new Posts(row));
  }
};
