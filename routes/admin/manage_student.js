const express=require('express');
const router=express.Router();

const studentController=require('../../controller/admin/manage_student');

router.get('/admin/manage_student',studentController.getManageStudentPage);
router.get('/admin/manage_student/add',studentController.getAddstudentPage);
router.post('/admin/manage_student/add',studentController.postAddstudentPage);
router.get('/admin/manage_student/list',studentController.getstudentList)
router.get('/admin/manage_student/edit/:studentId',studentController.getEditstudentPage);
router.post('/admin/manage_student/edit',studentController.postEditstudent);
router.get('/admin/manage_student/delete/:studentId',studentController.deletestudent);

router.get('/admin/manage_student/select_student',studentController.getSelectstudentPage);
router.get('/admin/manage_student/select_student/:studentId',studentController.getregisterPage);
router.post('/admin/manage_student/select_student/:studentId/register',studentController.postregisterPage)


module.exports=router;