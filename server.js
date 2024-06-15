import sql from "mysql2";
import express from "express";
import cors from "cors";

const date = new Date();

//Server Configuration
const app = express(); //creating express server
app.use(express.json()); //for parsing json
app.use(cors()); //for cors policy

// connect to database
export const db = sql.createConnection({
  host: "localhost",
  user: "root",
  password: "2580",
  database: "lms",
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to MySQL!");
  }
});

{
  /**Courses APIs */
}

//get all courses published
app.get("/api/courses/published", (req, res) => {
  const q = "select * from course where isPublished = ?";
  db.query(q, [true], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

//get all courses
app.get("/api/courses/all", (req, res) => {
  const q = "select * from course";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.listen(3001, () => {
  console.log("Server started on port 3001");
});

//get  course by id
app.get("/api/courses/:id", (req, res) => {
  const q = "select * from course where id = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data[0]);
  });
});

//delete course by id
app.delete("/api/courses/:id", (req, res) => {
  const q = "delete from course where id = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

//create course
app.post("/api/courses/create", (req, res) => {
  const q =
    "insert into course (title, createdAt, updatedAt, userId) values (?, ?, ?, ?)";
  const values = [
    req.body.title,
    date.toLocaleString(),
    date.toLocaleString(),
    req.body.userId,
  ];
  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

//update course by :id
app.put("/api/courses/:id", (req, res) => {
  const { title, description, imageUrl, category, attachments, isPublished } =
    req.body;
  const q =
    "update course set title = ?, description = ?,imageUrl = ?,category = ?, attachments = ?, isPublished = ?, updatedAt = ? where id = ?";
  const values = [
    title,
    description,
    imageUrl,
    category,
    attachments,
    isPublished,
    date,
    req.params.id,
  ];
  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

{
  /**Chapters APIs */
}

//fetch chapters by course id
app.get("/api/chapters/:id", (req, res) => {
  const q = `
    SELECT * FROM chapter where courseId = ?
`;
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

//create chapter by course id
app.post("/api/chapter/create", (req, res) => {
  const q = `
        INSERT INTO chapter (title, courseId) VALUES (?, ?)
    `;
  db.query(q, [req.body.title, req.body.courseId], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

//delete chapter by id
app.delete("/api/chapter/:id", (req, res) => {
  const q = `
  DELETE FROM chapter WHERE id = ? 
`;
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

//update chapter by id
app.put("/api/chapter/:id", (req, res) => {
  const { title, description, videoUrl } = req.body;
  const q = `
  UPDATE chapter SET title = ?,description = ?, videoUrl = ? WHERE id = ?
`;
  db.query(q, [title, description, videoUrl, req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

//get chapter by id
app.get("/api/chapter/:id", (req, res) => {
  const q = `
        SELECT * FROM chapter where id = ?
    `;
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data[0]);
  });
});
