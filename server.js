import sql from "mysql2";
import express from "express";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerui from "swagger-ui-express";
import yaml from 'yamljs'
const DOcument = yaml.load("./swagger.yaml")

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'LMS API Documentation',
        version: '1.0.0',
        description: 'Simple LMS Platform created by @zainexperience(Senior Full-Stack developer at Arloodots Software House, Okara)',
      },
      servers: [
        {
          url: 'http://localhost:3001',
        },
      ],
    },
    apis: ['./server.js'], // files containing annotations as above
  };

  const swaggerSpec = swaggerJSDoc(options);

  





const date = new Date();

//Server Configuration
const app = express(); //creating express server
app.use(express.json()); //for parsing json
app.use(cors()); //for cors policy


app.use("/api/docs", swaggerui.serve, swaggerui.setup(DOcument))


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

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - title
 *         - createdAt
 *         - updatedAt
 *         - userId
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the course
 *         title:
 *           type: string
 *           description: The title of the course
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the course was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the course was last updated
 *         userId:
 *           type: integer
 *           description: The id of the user who created the course
 *       example:
 *         id: 1
 *         title: Introduction to Node.js
 *         createdAt: '2024-06-27T00:00:00.000Z'
 *         updatedAt: '2024-06-27T00:00:00.000Z'
 *         userId: 1
 */

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: The courses managing API
 */


/**
 * @swagger
 * /api/courses/published:
 *   get:
 *     summary: Returns the list of all published courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: The list of the published courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
app.get("/api/courses/published", (req, res) => {
  const q = "select * from course where isPublished = ?";
  db.query(q, [true], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

/**
 * @swagger
 * /api/courses/all:
 *   get:
 *     summary: Returns the list of all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: The list of the courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
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

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get the course by id
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The course id
 *     responses:
 *       200:
 *         description: The course description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: The course was not found
 */
app.get("/api/courses/:id", (req, res) => {
  const q = "select * from course where id = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data[0]);
  });
});

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Remove the course by id
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The course id
 *     responses:
 *       200:
 *         description: The course was deleted
 *       404:
 *         description: The course was not found
 */
app.delete("/api/courses/:id", (req, res) => {
  const q = "delete from course where id = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

/**
 * @swagger
 * /api/courses/create:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: The course was successfully created
 *       500:
 *         description: Some server error
 */
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

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update the course by id
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The course id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: The course was updated
 *       404:
 *         description: The course was not found
 *       500:
 *         description: Some error happened
 */
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Chapter:
 *       type: object
 *       required:
 *         - title
 *         - courseId
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the chapter
 *         title:
 *           type: string
 *           description: The title of the chapter
 *         courseId:
 *           type: integer
 *           description: The id of the course the chapter belongs to
 *         description:
 *           type: string
 *           description: The description of the chapter
 *         videoUrl:
 *           type: string
 *           description: The URL of the video for the chapter
 *       example:
 *         id: 1
 *         title: Introduction to Node.js
 *         courseId: 1
 *         description: 'This chapter covers the basics of Node.js'
 *         videoUrl: 'http://example.com/video'
 */

/**
 * @swagger
 * tags:
 *   name: Chapters
 *   description: The chapters managing API
 */

/**
 * @swagger
 * /api/chapters/{courseId}:
 *   get:
 *     summary: Get all chapters by course id
 *     tags: [Chapters]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of the course
 *     responses:
 *       200:
 *         description: The list of the chapters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chapter'
 *       404:
 *         description: The course was not found
 */
app.get("/api/chapters/:id", (req, res) => {
  const q = `
    SELECT * FROM chapter where courseId = ?
`;
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

/**
 * @swagger
 * /api/chapter/create:
 *   post:
 *     summary: Create a new chapter
 *     tags: [Chapters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Chapter'
 *     responses:
 *       200:
 *         description: The chapter was successfully created
 *       500:
 *         description: Some server error
 */
app.post("/api/chapter/create", (req, res) => {
  const q = `
        INSERT INTO chapter (title, courseId) VALUES (?, ?)
    `;
  db.query(q, [req.body.title, req.body.courseId], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

/**
 * @swagger
 * /api/chapter/{id}:
 *   delete:
 *     summary: Remove the chapter by id
 *     tags: [Chapters]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The chapter id
 *     responses:
 *       200:
 *         description: The chapter was deleted
 *       404:
 *         description: The chapter was not found
 */
app.delete("/api/chapter/:id", (req, res) => {
  const q = `
  DELETE FROM chapter WHERE id = ? 
`;
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

/**
 * @swagger
 * /api/chapter/{id}:
 *   put:
 *     summary: Update the chapter by id
 *     tags: [Chapters]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The chapter id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Chapter'
 *     responses:
 *       200:
 *         description: The chapter was updated
 *       404:
 *         description: The chapter was not found
 *       500:
 *         description: Some error happened
 */
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

/**
 * @swagger
 * /api/chapter/{id}:
 *   get:
 *     summary: Get the chapter by id
 *     tags: [Chapters]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The chapter id
 *     responses:
 *       200:
 *         description: The chapter description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chapter'
 *       404:
 *         description: The chapter was not found
 */
app.get("/api/chapter/:id", (req, res) => {
  const q = `
        SELECT * FROM chapter where id = ?
    `;
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data[0]);
  });
});
