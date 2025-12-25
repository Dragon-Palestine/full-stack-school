const express=require('express');
const router=express.Router();

const subjectController=require('../../controller/admin/manage_subject');

router.get('/admin/manage_subject',subjectController.getManageSubjectPage);
router.get('/admin/manage_subject/add',subjectController.getAddSubjectPage);
router.post('/admin/manage_subject/add',subjectController.postAddSubjectPage)
router.get('/admin/manage_subject/list',subjectController.getListSubjectPage);
router.get('/admin/manage_subject/edit/:subjectCode',subjectController.getEditSubjectPage);
router.post('/admin/manage_subject/edit',subjectController.postEditSubjectPage);
router.get('/admin/manage_subject/delete/:subjectCode',subjectController.deleteSubject);

module.exports=router;