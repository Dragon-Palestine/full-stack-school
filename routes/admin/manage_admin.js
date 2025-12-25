const express=require('express');
const router=express.Router();

const adminController=require('../../controller/admin/manage_admin');

router.get('/admin',adminController.getAdminPage);

router.get('/admin/manage_admin',adminController.getManageAdminPage)
router.get('/admin/manage_admin/add',adminController.getAddAdminPage)
router.post('/admin/manage_admin/add',adminController.postAddAdminPage);
router.get('/admin/manage_admin/list',adminController.getListAdminPage);
router.get('/admin/manage_admin/edit/:adminId',adminController.getEditAdminPage);
router.post('/admin/manage_admin/edit',adminController.postEditAdmin);
router.get('/admin/manage_admin/delete/:adminId',adminController.deleteAdmin);
router.get('/admin/manage_admin/manage_permission',adminController.sellectPersonTogetManagePermissionPage);
router.get('/admin/manage_permission/:personId',adminController.getManagePermissionPage);
router.post('/admin/update_permission',adminController.postManagePermissionPage);




module.exports=router;