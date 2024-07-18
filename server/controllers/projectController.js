const connection = require("../models/db");

const extractFirstImage = content => {
  if (!content) return null; // content가 undefined인 경우 처리
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

  // 현재 날짜를 'YYYY-MM-DD' 형식으로 가져오기
  const currentDate = new Date().toISOString().split("T")[0];

  // 상태를 결정
  let status;
  if (startDate > currentDate) {
    status = "pending";
  } else if (startDate <= currentDate && endDate >= currentDate) {
    status = "active";
  } else if (endDate < currentDate) {
    status = "completed";
  }

  const createProjectQuery = `
    INSERT INTO project (title, description, type, target_amount, start_date, end_date, created_by, max_participants, options, main_image, account_info, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    status,
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

exports.checkParticipation = (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.params.userId;

  console.log(
    "Checking participation for project:",
    projectId,
    "and user:",
    userId
  ); // 디버깅용 콘솔 로그

  const query = `
    SELECT COUNT(*) as isParticipating
    FROM participant
    WHERE project_id = ? AND user_id = ?
  `;

  connection.query(query, [projectId, userId], (error, results) => {
    if (error) {
      console.error("Error checking participation status:", error);
      res.status(500).send("Server error");
      return;
    }

    const isParticipating = results[0].isParticipating > 0;
    console.log("Participation check results:", results); // 결과 확인
    res.status(200).json({ isParticipating });
  });
};

exports.participateInProject = (req, res) => {
  const projectId = req.params.id;
  const userId = req.user.userId;
  const { selectedOptions, options, applicantName, email, phone, agreement } =
    req.body;

  const checkQuery = `
    SELECT COUNT(*) as count
    FROM participant
    WHERE project_id = ? AND user_id = ?
  `;

  connection.query(
    checkQuery,
    [projectId, userId],
    (checkError, checkResults) => {
      if (checkError) {
        console.error("Error checking participation:", checkError);
        res.status(500).send("Server error");
        return;
      }

      if (checkResults[0].count > 0) {
        res.status(409).send("Already participating");
        return;
      }

      const insertParticipantQuery = `
      INSERT INTO participant (project_id, user_id)
      VALUES (?, ?)
    `;

      connection.query(
        insertParticipantQuery,
        [projectId, userId],
        (insertError, insertResults) => {
          if (insertError) {
            console.error("Error participating in project:", insertError);
            res.status(500).send("Server error");
            return;
          }

          const participantId = insertResults.insertId;

          const insertDetailsQuery = `
            INSERT INTO participant_details (participant_id, user_id, option_selected, quantity, applicant_name, email, phone, agreement)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const insertDetailsTasks = [];

          if (selectedOptions && selectedOptions.length > 0) {
            selectedOptions.forEach(option => {
              insertDetailsTasks.push(
                new Promise((resolve, reject) => {
                  connection.query(
                    insertDetailsQuery,
                    [
                      participantId,
                      userId,
                      option,
                      null,
                      applicantName,
                      email,
                      phone,
                      agreement,
                    ],
                    (detailsError, detailsResults) => {
                      if (detailsError) {
                        reject(detailsError);
                      } else {
                        resolve(detailsResults);
                      }
                    }
                  );
                })
              );
            });
          }

          if (options && options.length > 0) {
            options.forEach(option => {
              insertDetailsTasks.push(
                new Promise((resolve, reject) => {
                  connection.query(
                    insertDetailsQuery,
                    [
                      participantId,
                      userId,
                      option.name,
                      option.quantity,
                      applicantName,
                      email,
                      phone,
                      agreement,
                    ],
                    (detailsError, detailsResults) => {
                      if (detailsError) {
                        reject(detailsError);
                      } else {
                        resolve(detailsResults);
                      }
                    }
                  );
                })
              );
            });
          }

          if (insertDetailsTasks.length > 0) {
            Promise.all(insertDetailsTasks)
              .then(() => {
                res.status(200).send("Participation successful");
              })
              .catch(error => {
                console.error("Error inserting participant details:", error);
                res.status(500).send("Server error");
              });
          } else {
            res.status(200).send("Participation successful");
          }
        }
      );
    }
  );
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
      return res.status(500).send("Server error");
    }

    if (results.length === 0) {
      return res.status(404).send("Project not found");
    }

    console.log("Fetched project data:", results[0]); // 디버깅용 로그
    res.status(200).json(results[0]);
  });
};

exports.incrementViewCount = (req, res) => {
  const projectId = req.params.id;

  if (isNaN(projectId)) {
    return res.status(400).send("Invalid project ID");
  }

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
  console.log("User information from authMiddleware:", req.user); // 추가된 로그
  const projectId = req.params.id;
  const userId = req.user.userId; // 변경된 부분

  console.log(`Toggling honey for project ${projectId} by user ${userId}`);

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

// projectController.js

exports.searchProjects = (req, res) => {
  const query = req.query.query;

  const searchQuery = `
    SELECT DISTINCT p.*, u.username AS author
    FROM project p
    JOIN user u ON p.created_by = u.id
    JOIN projecthashtag ph ON p.id = ph.project_id
    JOIN hashtag h ON ph.hashtag_id = h.id
    WHERE h.name LIKE ?
    ORDER BY p.created_at DESC
  `;

  connection.query(searchQuery, [`%${query}%`], (error, results) => {
    if (error) {
      console.error("Error searching projects:", error);
      res.status(500).send("Server error");
      return;
    }
    res.status(200).json(results);
  });
};

exports.getUserProjects = (req, res) => {
  const userId = req.user.userId;

  const query = `
    SELECT *
    FROM project
    WHERE created_by = ?
    ORDER BY created_at DESC
  `;

  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error fetching projects:", error);
      res.status(500).send("Server error");
      return;
    }

    const activeProjects = results.filter(
      project => project.status === "active"
    );
    const finishedProjects = results.filter(
      project => project.status === "completed"
    );
    const pendingProjects = results.filter(
      project => project.status === "pending"
    );

    res.status(200).json({
      activeProjects,
      finishedProjects,
      pendingProjects,
    });
  });
};

exports.getParticipatedProjects = (req, res) => {
  const userId = req.user.userId;

  const query = `
    SELECT p.*, u.username AS author
    FROM project p
    JOIN participant pa ON p.id = pa.project_id
    JOIN user u ON p.created_by = u.id
    WHERE pa.user_id = ?
    ORDER BY p.created_at DESC
  `;

  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error fetching participated projects:", error);
      res.status(500).send("Server error");
      return;
    }

    const activeProjects = results.filter(
      project => project.status === "active"
    );
    const finishedProjects = results.filter(
      project => project.status === "completed"
    );
    const pendingProjects = results.filter(
      project => project.status === "pending"
    );

    res.status(200).json({
      activeProjects,
      finishedProjects,
      pendingProjects,
    });
  });
};
exports.getBookmarkedProjects = (req, res) => {
  const userId = req.user.userId;

  const query = `
    SELECT p.*, u.username AS author, 
           CASE WHEN h.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS scrapState
    FROM project p
    LEFT JOIN honeypot h ON p.id = h.project_id AND h.user_id = ?
    JOIN user u ON p.created_by = u.id
    WHERE h.user_id = ?
    ORDER BY p.created_at DESC
  `;

  connection.query(query, [userId, userId], (error, results) => {
    if (error) {
      console.error("Error fetching bookmarked projects:", error);
      res.status(500).send("Server error");
      return;
    }

    const activeProjects = results.filter(
      project => project.status === "active"
    );
    const finishedProjects = results.filter(
      project => project.status === "completed"
    );
    const pendingProjects = results.filter(
      project => project.status === "pending"
    );

    res.status(200).json({
      activeProjects,
      finishedProjects,
      pendingProjects,
    });
  });
};

exports.getProjectWithAuthor = (req, res) => {
  const projectId = req.params.id;
  console.log("Fetching project with author for project ID:", projectId); // 디버깅 로그 추가

  const projectQuery = `
    SELECT p.*, u.username, u.profile_image, u.intro
    FROM project p
    LEFT JOIN user u ON p.created_by = u.id
    WHERE p.id = ?
  `;

  connection.query(projectQuery, [projectId], (error, results) => {
    if (error) {
      console.error("Error fetching project with author:", error);
      res.status(500).send("Server error");
      return;
    }

    if (results.length === 0) {
      console.log("Project not found for ID:", projectId); // 디버깅 로그 추가
      res.status(404).send("Project not found");
      return;
    }

    const projectData = results[0];

    // 디버깅 로그로 결과 출력
    console.log("Raw project data:", projectData);

    // 사용자 정보가 없는 경우 기본값 설정
    projectData.username = projectData.username || "Unknown";
    projectData.profile_image = projectData.profile_image || "";
    projectData.intro = projectData.intro || "No introduction provided.";

    console.log("Project with author fetched successfully:", projectData); // 디버깅 로그 추가
    res.status(200).json(projectData);
  });
};

exports.deleteProjectById = (req, res) => {
  const projectId = req.params.id;
  console.log("Deleting project with ID:", projectId); // 디버깅 로그 추가

  const deleteParticipantDetailsQuery = `
    DELETE FROM participant_details 
    WHERE participant_id IN (SELECT id FROM participant WHERE project_id = ?);
  `;

  const deleteParticipantQuery = `
    DELETE FROM participant WHERE project_id = ?;
  `;

  const deleteProjectHashtagQuery = `
    DELETE FROM projecthashtag WHERE project_id = ?;
  `;

  const deleteFundingQuery = `
    DELETE FROM funding WHERE project_id = ?;
  `;

  const deleteHoneypotQuery = `
    DELETE FROM honeypot WHERE project_id = ?;
  `;

  const deleteAccompanimentQuery = `
    DELETE FROM accompaniment WHERE project_id = ?;
  `;

  const deleteProjectQuery = `
    DELETE FROM project WHERE id = ?;
  `;

  connection.beginTransaction(err => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).send("Transaction error");
    }

    connection.query(deleteParticipantDetailsQuery, [projectId], err => {
      if (err) {
        console.error("Error deleting participant details:", err);
        return connection.rollback(() => {
          res.status(500).send("Server error");
        });
      }

      connection.query(deleteParticipantQuery, [projectId], err => {
        if (err) {
          console.error("Error deleting participants:", err);
          return connection.rollback(() => {
            res.status(500).send("Server error");
          });
        }

        connection.query(deleteProjectHashtagQuery, [projectId], err => {
          if (err) {
            console.error("Error deleting project hashtags:", err);
            return connection.rollback(() => {
              res.status(500).send("Server error");
            });
          }

          connection.query(deleteFundingQuery, [projectId], err => {
            if (err) {
              console.error("Error deleting fundings:", err);
              return connection.rollback(() => {
                res.status(500).send("Server error");
              });
            }

            connection.query(deleteHoneypotQuery, [projectId], err => {
              if (err) {
                console.error("Error deleting honeypot:", err);
                return connection.rollback(() => {
                  res.status(500).send("Server error");
                });
              }

              connection.query(deleteAccompanimentQuery, [projectId], err => {
                if (err) {
                  console.error("Error deleting accompaniment:", err);
                  return connection.rollback(() => {
                    res.status(500).send("Server error");
                  });
                }

                connection.query(deleteProjectQuery, [projectId], err => {
                  if (err) {
                    console.error("Error deleting project:", err);
                    return connection.rollback(() => {
                      res.status(500).send("Server error");
                    });
                  }

                  connection.commit(err => {
                    if (err) {
                      console.error("Error committing transaction:", err);
                      return connection.rollback(() => {
                        res.status(500).send("Transaction commit error");
                      });
                    }
                    console.log("Project deleted successfully");
                    res.status(200).send("Project deleted successfully");
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

exports.updateProject = (req, res) => {
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
  const projectId = req.params.id;
  const mainImage = extractFirstImage(content);

  // 현재 날짜를 'YYYY-MM-DD' 형식으로 가져오기
  const currentDate = new Date().toISOString().split("T")[0];

  // 상태를 결정
  let status;
  if (startDate > currentDate) {
    status = "pending";
  } else if (startDate <= currentDate && endDate >= currentDate) {
    status = "active";
  } else if (endDate < currentDate) {
    status = "completed";
  }

  // type이 null일 경우 기본값 설정
  const projectType = type || "defaultType";

  console.log("Updating project with data:", {
    title,
    content,
    projectType,
    targetAmount,
    startDate,
    endDate,
    createdBy,
    maxParticipants,
    options,
    mainImage,
    accountInfo,
    status,
  });

  const updateProjectQuery = `
    UPDATE project 
    SET title = ?, description = ?, type = ?, target_amount = ?, start_date = ?, end_date = ?, created_by = ?, max_participants = ?, options = ?, main_image = ?, account_info = ?, status = ?
    WHERE id = ?
  `;
  const projectValues = [
    title,
    content,
    projectType, // projectType으로 변경
    targetAmount || null,
    startDate,
    endDate,
    createdBy,
    maxParticipants,
    JSON.stringify(options),
    mainImage,
    accountInfo,
    status,
    projectId,
  ];

  connection.query(updateProjectQuery, projectValues, (error, results) => {
    if (error) {
      console.error("Error updating project:", error);
      res.status(500).send("Server error");
      return;
    }

    if (hashtags && hashtags.length > 0) {
      const deleteHashtagQuery = `
        DELETE FROM projecthashtag WHERE project_id = ?
      `;

      connection.query(deleteHashtagQuery, [projectId], error => {
        if (error) {
          console.error("Error deleting project hashtags:", error);
          res.status(500).send("Server error");
          return;
        }

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
              res.status(200).json({ message: "Project updated", projectId });
            }
          );
        });
      });
    } else {
      res.status(200).json({ message: "Project updated", projectId });
    }
  });
};
