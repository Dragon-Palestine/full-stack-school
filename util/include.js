const Admin = require("../models/admin");
const Attendance = require("../models/attendance");
const Grade = require("../models/grade");
const Student = require("../models/student");
const Subject = require("../models/subject");
const Teacher = require("../models/teacher");
const Registartion = require("../models/registartion");
const Teacher_subject = require("../models/teacher_subject");
const Permission = require("../models/permission");
const Person = require("../models/person");
const Login = require("../models/login");
const AttendanceDate = require("../models/attendanceDate");

module.exports = {
  Admin: Admin,
  Attendance: Attendance,
  Grade: Grade,
  Student: Student,
  Subject: Subject,
  Teacher: Teacher,
  Registartion:Registartion,
  Teacher_subject:Teacher_subject,
  Permission:Permission,
  Person:Person,
  Login:Login,
  AttendanceDate:AttendanceDate,
};
