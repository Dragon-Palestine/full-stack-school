const Table = require("../../util/include");
const funcs = require("../../util/funcs");
const permission = require("../../models/permission");
const em = [{}, {}];

exports.getAdminPage = async(req, res, next) => { 
  const role = req.session.role; 
  const permission = req.session.permission; 

  if (role !== "admin") { 
    funcs.allow(res, "you are not an admin !!"); 
    return; 
  } 
  res.render("ejs/admin/home", { title: "Admin", permission }); 
};

exports.getManageAdminPage = async (req, res, next) => {
  const permission = req.session.permission;
  if (!permission.manageAdmin) {
    funcs.allow(res);
    return;
  }
  res.render("ejs/admin/manage-admin/home", {
    title: "Manage Admin",
    admins: em,
  });
};

exports.getAddAdminPage = (req, res, next) => {
  const permissions = [
    "manageAdmin",
    "manageTeacher",
    "manageStudent",
    "manageSubject",
    "manageGrade",
    "manageAttendance",
    "assignSubjectToTeacher",
    "assignSubjectToStudent",
    "managePermission",
  ];
  res.render("ejs/common/add-person", {
    title: "Add Admin",
    role: "Admin",
    link: "/admin/manage_admin/add",
    permissions: permissions,
    role:req.session.role,
    For:'admin'
  });
};

exports.postAddAdminPage = async (req, res, next) => {
  const pass = req.body.password;
  const repass = req.body.confirmPassword;
  let per = req.body.permissions;
  const ownerPer = req.session.permission;
  if (per && typeof per != typeof []) per = [per];

  const userExist = await Table.Login.findByPk(req.body.username);

  if (pass != repass) {
    funcs.allow(res, "no matches a password");
    return;
  }
  if (userExist) {
    funcs.allow(res, "this user is exist !!");
    return;
  }
  let notAllow = false;
  if(per)
  for (p of per) {
    if (!ownerPer[p]) {
      notAllow = true;
    }
  }
  if (notAllow) {
    funcs.allow(
      res,
      "you set a permission was not accsess for the curent admin"
    );
    return;
  }
  const person = await funcs.addPerson(req, "admin");
  if(per){
    const permission=await funcs.addPermission(per);
    await person.setPermission(permission);
  }else{
    await  person.createPermission(funcs.getPermission(false));
  }
  const login = await funcs.addLogin(req);

  await person.createAdmin();
  await person.setLogin(login);

  res.redirect("/admin/manage_admin/list");
};

exports.getListAdminPage = async (req, res, next) => {
  const admins = await Table.Person.findAll({ where: { role: "admin" } });
  res.render("ejs/common/list", {
    title: "Admins",
    persons: admins,
    For: "admin",
    role:req.session.role,
  });
};

exports.getEditAdminPage = async (req, res, next) => {
  const personId = req.params.adminId;
  const person = await Table.Person.findByPk(personId);
  res.render("ejs/common/edit-person", {
    title: "Edit Admin",
    person: person,
    link: "/admin/manage_admin/edit",
    role:req.session.role,
  });
};

exports.postEditAdmin = async (req, res, next) => {
  const name = req.body.name;
  const age = req.body.age;
  const phone = req.body.phone;
  const gender = req.body.gender;
  const email = req.body.email;
  const personId = req.body.personId;

  const person = await Table.Person.findByPk(personId);
  await person.set({
    name: name,
    age: age,
    email: email,
    phone: phone,
    gender: gender,
  });
  await person.save();

  res.redirect("/admin/manage_admin/list");
};

exports.deleteAdmin = async (req, res, next) => {
  const personId = req.params.adminId;
  const person = await Table.Person.findByPk(personId);
  const admin = await person.getAdmin();
  const permission = await person.getPermission();
  const login = await person.getLogin();
  if (login.user == req.session.user) {
    funcs.allow(res, "are you creazy , not allow delete your self !!");
    return;
  }

  await admin.destroy();
  await login.destroy();
  await permission.destroy();
  await person.destroy();

  // you need reload this page just !!
  res.redirect("/admin/manage_admin/list");
};

exports.sellectPersonTogetManagePermissionPage = async (req, res, next) => {
  const permission = req.session.permission;

  if (!permission.managePermission) {
    funcs.allow(res);
    return;
  }

  const admins = await Table.Person.findAll({ where: { role: "admin" } });
  const teachers = await Table.Person.findAll({ where: { role: "teacher" } });
  const students = await Table.Person.findAll({ where: { role: "student" } });

  res.render("ejs/admin/manage-admin/select_person", {
    title: "Manage Permission",
    admins,
    teachers,
    students,
  });
};

exports.getManagePermissionPage = async (req, res, next) => {
  const personId = req.params.personId;
  if(personId==1){
    funcs.allow(res,'not allowed change the owner permissions !! ');
    return;
  }
  const person = await Table.Person.findByPk(personId);
  const permission = await person.getPermission();
  res.render("ejs/admin/manage-admin/edit-permission", {
    title: "Edit Permission",
    person,
    permission,
  });
};
exports.postManagePermissionPage = async (req, res, next) => {
  const permissions = [
    "manageAdmin",
    "manageTeacher",
    "manageStudent",
    "manageSubject",
    "manageGrade",
    "manageAttendance",
    "assignSubjectToTeacher",
    "assignSubjectToStudent",
    "managePermission",
  ];
  let { personId, newPermissions } = req.body;
  const person = await Table.Person.findByPk(personId);
  const oldPermisson = await person.getPermission();
  newPermissions = funcs.toList(newPermissions);

  const added = [];
  const removed = [];

  for (let per of permissions) {
    if (oldPermisson[per] && !newPermissions.includes(per)) removed.push(per);
  }
  for (let per of newPermissions) {
    if (!oldPermisson[per]) added.push(per);
  }
  
  const ownerPermission=req.session.permission;

  let notAllow=false;
  for(let per of added){
    if(!ownerPermission[per])notAllow='added';
    oldPermisson[per]=true;
  }
  for(let per of removed){
    if(!ownerPermission[per])notAllow='removed';
    oldPermisson[per]=false;
  }

  if(notAllow){
    funcs.allow(res,`you ${notAllow} a permission you not has it !!`);
    return;
  }
  
  await oldPermisson.save();
  if(personId==req.session.personId){
    res.redirect('/logout');
    return;
  }
  res.redirect('/admin/manage_admin/manage_permission');
};
