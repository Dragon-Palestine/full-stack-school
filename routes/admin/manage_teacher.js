const express=require('express')
const router=express.Router();

const teacherController=require('../../controller/admin/manage_teacher');
router.get('/admin/manage_teacher',teacherController.getManageTeacherPage);
router.get('/admin/manage_teacher/add',teacherController.getAddTeacherPage);
router.post('/admin/manage_teacher/add',teacherController.postAddTeacherPage);
router.get('/admin/manage_teacher/list',teacherController.getTeacherList)
router.get('/admin/manage_teacher/edit/:teacherId',teacherController.getEditTeacherPage);
router.post('/admin/manage_teacher/edit',teacherController.postEditTeacher);
router.get('/admin/manage_teacher/delete/:teacherId',teacherController.deleteTeacher);
router.get('/admin/manage_teacher/select_teacher',teacherController.getSelectTeacherPage);
router.get('/admin/manage_teacher/select_teacher/:teacherId',teacherController.getAssignPage);
router.post('/admin/manage_teacher/select_teacher/:teacherId/assign',teacherController.postAssignPage)

module.exports=router;