const connection = require("../models/db");

const extractFirstImage = content => {
  const imgTag = content.match(/<img[^>]+src="([^">]+)"/);
  return imgTag ? imgTag[1] : null;
};

exports.createProject = (req, res) => {
  const {
    title,
    content,
    type,
    targetAmount,
    startDate,
    endDate,
    createdBy,
    hashtags,
    maxParticipants,
    options,
    accountInfo,
  } = req.body;
  const mainImage = extractFirstImage(content);

  const createProjectQuery = `
    INSERT INTO project (title, description, type, target_amount, start_date, end_date, created_by, max_participants, options, main_image, account_info)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const projectValues = [
    title,
    content,
    type,
    targetAmount || null,
    startDate,
    endDate,
    createdBy,
    maxParticipants,
    JSON.stringify(options),
    mainImage,
    accountInfo,
  ];

  connection.query(createProjectQuery, projectValues, (error, results) => {
    if (error) {
      console.error("Error inserting project:", error);
      res.status(500).send("Server error");
      return;
    }

    const projectId = results.insertId;

    if (hashtags && hashtags.length > 0) {
      const hashtagQueries = hashtags
        .map(
          tag => `
        INSERT INTO hashtag (name)
        VALUES (?)
        ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)
      `
        )
        .join("; ");

      const hashtagValues = hashtags.flatMap(tag => [tag]);

      connection.query(hashtagQueries, hashtagValues, (error, results) => {
        if (error) {
          console.error("Error inserting hashtags:", error);
          res.status(500).send("Server error");
          return;
        }

        const hashtagIds = Array.isArray(results)
          ? results.map(result => result.insertId)
          : [results.insertId];
        const projectHashtagQueries = hashtagIds.map(
          hashtagId => `
          INSERT INTO projecthashtag (project_id, hashtag_id)
          VALUES (?, ?)
        `
        );
        const projectHashtagValues = hashtagIds.map(hashtagId => [
          projectId,
          hashtagId,
        ]);

        connection.query(
          projectHashtagQueries.join("; "),
          [].concat(...projectHashtagValues),
          error => {
            if (error) {
              console.error("Error inserting project hashtags:", error);
              res.status(500).send("Server error");
              return;
            }
            res.status(201).json({ message: "Project created", projectId });
          }
        );
      });
    } else {
      res.status(201).json({ message: "Project created", projectId });
    }
  });
};

exports.getProjects = (req, res) => {
  const query = `
    SELECT p.*, u.username AS author
    FROM project p
    JOIN user u ON p.created_by = u.id
    ORDER BY p.created_at DESC
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching projects:", error);
      res.status(500).send("Server error");
      return;
    }
    res.status(200).json(results);
  });
};

exports.getProjectHashtags = (req, res) => {
  const projectId = req.params.id;

  console.log(`Fetching hashtags for project ID: ${projectId}`);

  const query = `
    SELECT h.name
    FROM hashtag h
    JOIN projecthashtag ph ON h.id = ph.hashtag_id
    WHERE ph.project_id = ?
  `;

  connection.query(query, [projectId], (error, results) => {
    if (error) {
      console.error("Error fetching hashtags:", error);
      res.status(500).send("Server error");
      return;
    }

    const hashtags = results.map(row => row.name);
    console.log(`Fetched hashtags: ${hashtags}`);
    res.status(200).json(hashtags);
  });
};

exports.getProjectParticipants = (req, res) => {
  const projectId = req.params.id;

  const query = `
    SELECT COUNT(*) as currentParticipants
    FROM participant
    WHERE project_id = ?
  `;

  connection.query(query, [projectId], (error, results) => {
    if (error) {
      console.error("Error fetching participants:", error);
      res.status(500).send("Server error");
      return;
    }

    const currentParticipants = results[0].currentParticipants;
    res.status(200).json({ currentParticipants });
  });
};

exports.getProjectHoney = (req, res) => {
  const projectId = req.params.id;

  const query = `
    SELECT COUNT(*) as honeyCount
    FROM honeypot
    WHERE project_id = ?
  `;

  connection.query(query, [projectId], (error, results) => {
    if (error) {
      console.error("Error fetching honeypot count:", error);
      res.status(500).send("Server error");
      return;
    }

    const honeyCount = results[0].honeyCount;
    res.status(200).json({ honeyCount });
  });
};

exports.getUserHoneyStatus = (req, res) => {
  const projectId = req.params.id;
  const userId = req.params.userId;

  const query = `
    SELECT COUNT(*) as isHoney
    FROM honeypot
    WHERE project_id = ? AND user_id = ?
  `;

  connection.query(query, [projectId, userId], (error, results) => {
    if (error) {
      console.error("Error fetching user honey status:", error);
      res.status(500).send("Server error");
      return;
    }

    const isHoney = results[0].isHoney > 0;
    res.status(200).json({ isHoney });
  });
};

exports.addProjectHoney = (req, res) => {
  const projectId = req.params.id;
  const { userId } = req.body;

  const query = `
    INSERT INTO honeypot (project_id, user_id)
    VALUES (?, ?)
  `;

  connection.query(query, [projectId, userId], error => {
    if (error) {
      console.error("Error adding honeypot:", error);
      res.status(500).send("Server error");
      return;
    }

    res.status(201).send("Honeypot added");
  });
};

exports.removeProjectHoney = (req, res) => {
  const projectId = req.params.id;
  const { userId } = req.body;

  const query = `
    DELETE FROM honeypot
    WHERE project_id = ? AND user_id = ?
  `;

  connection.query(query, [projectId, userId], error => {
    if (error) {
      console.error("Error removing honeypot:", error);
      res.status(500).send("Server error");
      return;
    }

    res.status(200).send("Honeypot removed");
  });
};

exports.getProjectById = (req, res) => {
  const projectId = req.params.id;

  const query = `
    SELECT p.*, u.username AS author
    FROM project p
    JOIN user u ON p.created_by = u.id
    WHERE p.id = ?
  `;

  connection.query(query, [projectId], (error, results) => {
    if (error) {
      console.error("Error fetching project:", error);
      res.status(500).send("Server error");
      return;
    }

    if (results.length === 0) {
      res.status(404).send("Project not found");
      return;
    }

    res.status(200).json(results[0]);
  });
};

exports.incrementViewCount = (req, res) => {
  const projectId = req.params.id;

  const query = `
    UPDATE project
    SET view_count = view_count + 1
    WHERE id = ?
  `;

  connection.query(query, [projectId], (error, results) => {
    if (error) {
      console.error("Error incrementing view count:", error);
      res.status(500).send("Server error");
      return;
    }

    res.status(200).send("View count incremented");
  });
};

// Add toggleHoney function
exports.toggleHoney = (req, res) => {
  const projectId = req.params.id;
  const { userId } = req.body;

  const checkQuery = `
    SELECT * FROM honeypot WHERE project_id = ? AND user_id = ?
  `;

  connection.query(checkQuery, [projectId, userId], (error, results) => {
    if (error) {
      console.error("Error checking honeypot:", error);
      res.status(500).send("Server error");
      return;
    }

    if (results.length > 0) {
      // Honey exists, so remove it
      const deleteQuery = `
        DELETE FROM honeypot WHERE project_id = ? AND user_id = ?
      `;
      connection.query(deleteQuery, [projectId, userId], deleteError => {
        if (deleteError) {
          console.error("Error removing honeypot:", deleteError);
          res.status(500).send("Server error");
          return;
        }
        res.status(200).send("Honeypot removed");
      });
    } else {
      // Honey does not exist, so add it
      const insertQuery = `
        INSERT INTO honeypot (project_id, user_id) VALUES (?, ?)
      `;
      connection.query(insertQuery, [projectId, userId], insertError => {
        if (insertError) {
          console.error("Error adding honeypot:", insertError);
          res.status(500).send("Server error");
          return;
        }
        res.status(201).send("Honeypot added");
      });
    }
  });
};
exports.checkProjectHoney = (req, res) => {
  const projectId = req.params.id;
  const userId = req.params.userId;

  const query = `
    SELECT 1
    FROM honeypot
    WHERE project_id = ? AND user_id = ?
    LIMIT 1
  `;

  connection.query(query, [projectId, userId], (error, results) => {
    if (error) {
      console.error("Error checking honeypot:", error);
      res.status(500).send("Server error");
      return;
    }

    const isHoney = results.length > 0;
    res.status(200).json({ isHoney });
  });
};
