const express=require('express');
const router=express.Router();

const studentController=require('../../controller/student/home');

router.get('/student',studentController.getSubjects);

router.post('/student/subject/action',studentController.handelSubjectAction)
router.get('/student/subject/grade/:subjectCode',studentController.getGrade);

router.get('/student/subject/attendance/chooseDate/:subjectCode',studentController.chooseDate);
router.post('/student/subject/attendance/chooseDate/:subjectCode',studentController.getAttendance);
router.post('/student/subject/attendance',studentController.postAttendanceStudent);



module.exports=router;