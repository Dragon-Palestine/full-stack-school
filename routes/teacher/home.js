const express=require('express');
const router=express.Router();

const subjectController=require('../../controller/teacher/home');

router.get('/teacher',subjectController.getHomePage);

router.get('/teacher/subject/student/:subjectCode',subjectController.getStudent);
router.get('/teacher/subject/delete/:subjectCode/:studentId',subjectController.getDeleteStudent)
router.get('/teacher/subject/student/:subjectCode/add',subjectController.addStudentToSubject);
router.get('/teacher/subject/student/:subjectCode/add/:studentId',subjectController.saveStudentAfterAdd);

router.get('/teacher/subject/grade/:subjectCode/:studentId',subjectController.getGradeStudent);
router.post('/teacher/subject/grade',subjectController.postGradeStudent)

router.get('/teacher/subject/attendance/date/:subjectCode/:studentId',subjectController.getDateForStudent);
router.post('/teacher/subject/attendance/:subjectCode/:studentId/',subjectController.getAttendanceStudent);
router.post('/teacher/subject/attendance',subjectController.postAttendanceStudent)

// router.get('/teacher/subject/date/:subjectCode',subjectController.getDateAttendance);
// router.post('/teacher/subject/date',subjectController.getAttendanceStudents);

// router.get('/teacher/grades/:subjectCode',subjectController.getGrades)

module.exports=router;