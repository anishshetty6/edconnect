const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect MongoDB

const MONGO_URI =
  "mongodb+srv://ashishsatavase13:admin@cluster0.vmr4f.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(
  "mongodb+srv://ashishsatavase13:admin@cluster0.vmr4f.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.once("open", () => console.log("MongoDB connected"));

// Schemas
const schoolSchema = new mongoose.Schema({
  schoolName: String,
  schoolAddress: String,
  udiseNumber: { type: String, unique: true },
  password: String,
});

const volunteerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  experience: String,
  availability: [String],
  subjects: [String],
  standard: [String],
  password: String,
});

const studentSchema = new mongoose.Schema({
  name: String,
  standard: String,
  rollNo: String,
  sapId: { type: String, unique: true },
  password: String,
  schoolId: mongoose.Schema.Types.ObjectId,
});

const requestSchema = new mongoose.Schema({
  subjectName: String,
  date: String,
  topicName: String,
  description: String,
  schoolName: String,
  schoolId: mongoose.Schema.Types.ObjectId,
  volunteerId: { type: mongoose.Schema.Types.ObjectId, default: null },
});

const meetingSchema = new mongoose.Schema({
  volunteerId: mongoose.Schema.Types.ObjectId,
  title: String,
  startTime: String,
  endTime: String,
  standard: Number,
  location: String,
  description: String,
});

const testSchema = new mongoose.Schema({
  subject: String,
  title: String,
  standard: String,
  description: String,
  duration: Number,
  volunteerId: mongoose.Schema.Types.ObjectId,
  questions: [
    {
      id: String,
      text: String,
      options: [String],
      correctAnswer: Number,
    },
  ],
});

// Models
const School = mongoose.model("School", schoolSchema);
const Volunteer = mongoose.model("Volunteer", volunteerSchema);
const Student = mongoose.model("Student", studentSchema);
const Meeting = mongoose.model("Meeting", meetingSchema);
const Test = mongoose.model("Test", testSchema);
const Request = mongoose.model("Request", requestSchema);

// Routes

// SCHOOL
app.post("/api/school/register", async (req, res) => {
  try {
    const school = new School(req.body);
    await school.save();
    res.json({ message: "School registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/school/login", async (req, res) => {
  const { udiseNumber, password } = req.body;
  const school = await School.findOne({ udiseNumber, password });
  if (!school) return res.status(401).json({ error: "Invalid credentials" });
  res.json(school);
});

// VOLUNTEER
app.post("/api/volunteer/register", async (req, res) => {
  try {
    const volunteer = new Volunteer(req.body);
    await volunteer.save();
    res.json({ message: "Volunteer registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/volunteer/login", async (req, res) => {
  const { email, password } = req.body;
  const volunteer = await Volunteer.findOne({ email, password });
  if (!volunteer) return res.status(401).json({ error: "Invalid credentials" });
  res.json(volunteer);
});

// STUDENT
app.post("/api/student/create", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json({ message: "Student created" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/student/login", async (req, res) => {
  const { sapId, password } = req.body;
  const student = await Student.findOne({ sapId, password });
  if (!student) return res.status(401).json({ error: "Invalid credentials" });
  res.json(student);
});

// STUDENTS BY SCHOOL
app.get("/api/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// STUDENTS BY SCHOOL
app.get("/api/students/bySchool/:schoolId", async (req, res) => {
  try {
    const students = await Student.find({ schoolId: req.params.schoolId });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//request

app.post("/api/requests/create", async (req, res) => {
  try {
    const request = new Request(req.body);
    await request.save();
    res.json({ message: "Request created successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Assign volunteer to a request (volunteer accepts)
app.put("/api/requests/assign", async (req, res) => {
  const { requestId, volunteerId } = req.body;
  try {
    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      { volunteerId },
      { new: true }
    );
    if (!updatedRequest)
      return res.status(404).json({ error: "Request not found" });
    res.json({ message: "Volunteer assigned to request", updatedRequest });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/requests/unassigned", async (req, res) => {
  try {
    const requests = await Request.find({ volunteerId: null });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/requests/bySchool/:schoolId", async (req, res) => {
  try {
    const requests = await Request.find({ schoolId: req.params.schoolId });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MEETINGS
app.post("/api/meetings/create", async (req, res) => {
  try {
    const meeting = new Meeting(req.body);
    await meeting.save();
    res.json({ message: "Meeting created" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/meetings/byStandard/:standard", async (req, res) => {
  const meetings = await Meeting.find({ standard: req.params.standard });
  res.json(meetings);
});

app.get("/api/meetings/byVolunteer/:volunteerId", async (req, res) => {
  const meetings = await Meeting.find({ volunteerId: req.params.volunteerId });
  res.json(meetings);
});

// TESTS
app.post("/api/tests/create", async (req, res) => {
  try {
    const test = new Test({
      ...req.body,
      volunteerId: req.body.volunteerId,
    });
    await test.save();
    res.json({ message: "Test created" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Modified route to get all tests
app.get("/api/tests", async (req, res) => {
  const tests = await Test.find();
  const simplified = tests.map((test) => ({
    id: test._id,
    title: test.title,
    subject: test.subject,
    standard: test.standard,
    duration: test.duration,
    description: test.description,
    volunteerId: test.volunteerId,
    questionCount: test.questions.length,
  }));
  res.json(simplified);
});

// New route to get tests by standard
app.get("/api/tests/standard/:standard", async (req, res) => {
  try {
    const tests = await Test.find({ standard: req.params.standard });
    const simplified = tests.map((test) => ({
      id: test._id,
      title: test.title,
      subject: test.subject,
      standard: test.standard,
      duration: test.duration,
      description: test.description,
      volunteerId: test.volunteerId,
      questionCount: test.questions.length,
    }));
    res.json(simplified);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get test by ID
app.get("/api/tests/:testId", async (req, res) => {
  const test = await Test.findById(req.params.testId);
  if (!test) return res.status(404).json({ error: "Test not found" });
  res.json(test);
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
