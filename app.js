require('dotenv').config();

const express = require("express");
const app = express();
const path = require("path");


// make a session foe store user and role and permission
const session = require("express-session");
const FileStore = require("session-file-store")(session);
app.use(express.json());
app.use(
  session({
    store: new FileStore(),
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// to read a data
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// to help us find ejs and css
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

// use ejs
app.set("view engine", "ejs");
app.set("views", "views");
// -ejs

const loginRouter = require("./routes/sidBar/login");
app.use(loginRouter);

const logoutRouter = require("./routes/sidBar/logout");
app.use(logoutRouter);


const settingRouter = require("./routes/sidBar/setting");
app.use(settingRouter);

const adminRouter = require("./routes/admin/manage_admin");
const adminTeacherRouter = require("./routes/admin/manage_teacher");
const adminSubjectRouter = require("./routes/admin/manage_subject");
const adminStudentRouter = require("./routes/admin/manage_student");
app.use(adminRouter);
app.use(adminTeacherRouter);
app.use(adminSubjectRouter);
app.use(adminStudentRouter);

const teacherRouter = require("./routes/teacher/home");
app.use(teacherRouter);

const studentRouter = require("./routes/student/home");
app.use(studentRouter);

// relations
const Table = require("./util/include");

//*************************************** */

Table.Person.hasOne(Table.Admin, {
  foreignKey: "personId",
  onDelete: "CASCADE",
});
Table.Admin.belongsTo(Table.Person, {
  foreignKey: "personId",
});

Table.Person.hasOne(Table.Teacher, {
  foreignKey: "personId",
  onDelete: "CASCADE",
});
Table.Teacher.belongsTo(Table.Person, {
  foreignKey: "personId",
});

Table.Person.hasOne(Table.Student, {
  foreignKey: "personId",
  onDelete: "CASCADE",
});
Table.Student.belongsTo(Table.Person, {
  foreignKey: "personId",
});

//*************************************** */

Table.Person.hasOne(Table.Login, {
  foreignKey: "personId",
  onDelete: "CASCADE",
});
Table.Login.belongsTo(Table.Person, {
  foreignKey: "personId",
});

Table.Person.hasOne(Table.Permission, {
  foreignKey: "personId",
  onDelete: "CASCADE",
});
Table.Permission.belongsTo(Table.Person, {
  foreignKey: "personId",
});

//*************************************** */

Table.Teacher.belongsToMany(Table.Subject, {
  through: Table.Teacher_subject,
  foreignKey: "teacherId",
  otherKey: "subjectCode",
});

Table.Subject.belongsToMany(Table.Teacher, {
  through: Table.Teacher_subject,
  foreignKey: "subjectCode",
  otherKey: "teacherId",
});

//*************************************** */

Table.Student.belongsToMany(Table.Subject, {
  through: Table.Registartion,
  foreignKey: "studentId",
  otherKey: "subjectCode",
});

Table.Subject.belongsToMany(Table.Student, {
  through: Table.Registartion,
  foreignKey: "subjectCode",
  otherKey: "studentId",
});

//*************************************** */

Table.Registartion.belongsTo(Table.Student, {
  foreignKey: "studentId",
  onDelete: "CASCADE",
});
Table.Student.hasMany(Table.Registartion, {
  foreignKey: "studentId",
});

Table.Registartion.belongsTo(Table.Subject, {
  foreignKey: "subjectCode",
  onDelete: "CASCADE",
});
Table.Subject.hasMany(Table.Registartion, {
  foreignKey: "subjectCode",
});

Table.Registartion.belongsTo(Table.Teacher, {
  foreignKey: "teacherId",
  onDelete: "CASCADE",
});
Table.Teacher.hasMany(Table.Registartion, {
  foreignKey: "teacherId",
});

//*************************************** */

Table.Grade.hasOne(Table.Registartion, {
  foreignKey: "gradeId",
  onDelete: "CASCADE",
});
Table.Registartion.belongsTo(Table.Grade, {
  foreignKey: "gradeId",
});

//*************************************** */

Table.Attendance.hasOne(Table.Registartion, {
  foreignKey: "attendanceId",
  onDelete: "CASCADE",
});
Table.Registartion.belongsTo(Table.Attendance, {
  foreignKey: "attendanceId",
});


Table.Attendance.hasMany(Table.AttendanceDate, {
  foreignKey: "attendanceId",
  onDelete: "CASCADE",
});
Table.AttendanceDate.belongsTo(Table.Attendance, {
  foreignKey: "attendanceId",
});

module.exports = Table;


const sequelize = require("./util/database");
const funcs = require("./util/funcs");
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

sequelize
  .sync() // {force:true}
  .then(async (_) => {
    let FoundTheAwoner = await Table.Login.findByPk("loai");
    if (!FoundTheAwoner) {
      person = await Table.Person.create({
        name: "loai m gh",
        age: "23",
        phone: "0599955819",
        gender: "mail",
        email: "us@gmail.com",
        role: "admin",
      });
      await person.createLogin({ user: "loai", password: "171" });
      await person.createAdmin();
      await person.createPermission(funcs.getPermission(true));
      await person.save();
    }
    // http://localhost:72
    // npm start
    // npm run mine
    const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  });

  /*
  
git status
git add .
git commit -m "message"
git push
git push origin main


  */