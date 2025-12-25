const Table=require('../../util/include')
const funcs=require('../../util/funcs');
const teacher = require('../../models/teacher');
const { where } = require('sequelize');
const em=[{},{}]
exports.getManageTeacherPage=async(req,res,next)=>{
    const permission=req.session.permission;
    if(!permission.manageTeacher){
        funcs.allow(res);
        return;
    }
    res.render('ejs/admin/manage-teacher/home',{title:'Manage Teacher',teachers:em});
}

exports.getAddTeacherPage=(req,res,next)=>{
    const permissions=[
        'manageAdmin',
        'manageTeacher',
        'manageStudent',
        'manageSubject',
        'manageGrade',
        'manageAttendance',
        'assignSubjectToTeacher',
        'assignSubjectToStudent',
    ]
    res.render('ejs/common/add-person',{title:'Add Admin',role:req.session.role,link:'/admin/manage_teacher/add',permissions:permissions,For:'teacher'})
}

exports.postAddTeacherPage=async(req,res,next)=>{
    const pass=req.body.password;
    const repass=req.body.confirmPassword;
    let per=req.body.permissions;
    const ownerPer=req.session.permission;
    if(typeof per != typeof [])per=[per];

    const userExist=await Table.Login.findByPk(req.body.username);

    if(pass!=repass){
        funcs.allow(res,'no matches a password');
        return;
    }
    if(userExist){
        funcs.allow(res,'this user is exist !!');
        return;
    }
    let notAllow=false;
    for(p of per){
        if(!ownerPer[p]){
            notAllow=true;
        }
    }
    if(notAllow){
        funcs.allow(res,'you set a permission was not accsess for the curent teacher');
        return ;
    }

    const person=await funcs.addPerson(req,'teacher');
    const login=await funcs.addLogin(req);
    const permission=await funcs.addPermission(per);
    // const teacher=await Table.Teacher.create();
    await person.createTeacher();
    await person.setLogin(login);
    await person.setPermission(permission);

    res.redirect('/admin/manage_teacher/list');
}
exports.getTeacherList=async (req,res,next)=>{
    const teachers=await Table.Person.findAll({where:{role:'teacher'}});
    res.render('ejs/common/list',{title:'Teachers',persons:teachers,For:'teacher',role:req.session.role})
}

exports.getEditTeacherPage=async(req,res,next)=>{
    const personId=req.params.teacherId;
    const person=await Table.Person.findByPk(personId);
    res.render('ejs/common/edit-person',{title:'Edit Teacher',person:person,link:'/admin/manage_teacher/edit',role:req.session.role})
}


exports.postEditTeacher=async(req,res,next)=>{
    const name=req.body.name;
    const age=req.body.age;
    const phone=req.body.phone;
    const gender=req.body.gender;
    const email=req.body.email;
    const personId=req.body.personId;

    const person=await Table.Person.findByPk(personId);
    await person.set({name:name,age:age,email:email,phone:phone,gender:gender});
    await person.save();
    
    res.redirect('/admin/manage_teacher/list');
}

exports.deleteTeacher=async(req,res,next)=>{
    const personId=req.params.teacherId;
    const person=await Table.Person.findByPk(personId);
    const teacher=await person.getTeacher();
    const permission=await person.getPermission();
    const login=await person.getLogin();

    if(login.user==req.session.user){
        funcs.allow(res,'are you creazy , not allow delete your self !!');
        return;
    }
 
    await teacher.destroy();
    await login.destroy();
    await permission.destroy();
    await person.destroy();
    
    // you need reload this page just !!
    res.redirect('/admin/manage_teacher/list');
}
exports.getSelectTeacherPage=async(req,res,next)=>{
    const teachers=await Table.Person.findAll({where:{role:'teacher'}});
    res.render('ejs/admin/manage-teacher/select-teacher',{title:'Select a Teacher',teachers:teachers})
}
exports.getAssignPage=async(req,res,next)=>{
    const permission=req.session.permission;
    if(!permission.assignSubjectToTeacher){
        funcs.allow(res);
        return;
    }
    const personId=req.params.teacherId;
    const teacher=await Table.Teacher.findOne({where:{personId:personId}});
    let did=funcs.toList(await teacher.getSubjects());

    let temp={};
    for(d of did)temp[d.name]=true;

    did=temp;
    const subjects=await Table.Subject.findAll();
    res.render('ejs/admin/manage-teacher/assign',{title:'Assign Subject To You',subjects:subjects,did:did,teacherId:teacher.id})
}

exports.postAssignPage=async(req,res,next)=>{
    const selected=funcs.toList(req.body.selected);
    const removed=funcs.toList(req.body.nselected);
    const teacher=await Table.Teacher.findByPk(req.params.teacherId);
    // we here tryin to delete subject are non cheked -was cheked-
    if(removed) await teacher.removeSubjects(removed);

    if(selected) await teacher.addSubjects(selected);
    res.redirect('/admin/manage_teacher');
}
