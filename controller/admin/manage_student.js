const Table=require('../../util/include')
const funcs=require('../../util/funcs');
const { where } = require('sequelize');
const em=[{},{}]
exports.getManageStudentPage=async(req,res,next)=>{
    const permission=req.session.permission;
    if(!permission.manageStudent){
        funcs.allow(res);
        return;
    }
    res.render('ejs/admin/manage-student/home',{title:'Manage Student',students:em});
}

exports.getAddstudentPage=(req,res,next)=>{
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
    res.render('ejs/common/add-person',{title:'Add Admin',role:req.session.role,link:'/admin/manage_student/add',permissions:permissions,For:'student'})
}

exports.postAddstudentPage=async(req,res,next)=>{
    const pass=req.body.password;
    const repass=req.body.confirmPassword;
    let per=req.body.permissions;
    const ownerPer=funcs.toList(req.session.permission);
    if(per && typeof per != typeof [])per=[per];

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
    if(per)
    for(let p of per){
        if(!p)continue;
        if(!ownerPer[p]){
            notAllow=true;
        }
    }
    if(notAllow){
        funcs.allow(res,'you set a permission was not accsess for the curent student');
        return ;
    }

    const person=await funcs.addPerson(req,'student');
    const login=await funcs.addLogin(req);

    if(per){
        const permission=await funcs.addPermission(per);
        await person.setPermission(permission);
    }else{
        await  person.createPermission(funcs.getPermission(false));
    }
    await person.createStudent();
    await person.setLogin(login);

    res.redirect('/admin/manage_student/list');
}
exports.getstudentList=async (req,res,next)=>{
    const students=await Table.Person.findAll({where:{role:'student'}});
    res.render('ejs/common/list',{title:'students',persons:students,For:'student',role:req.session.role})
}

exports.getEditstudentPage=async(req,res,next)=>{
    const personId=req.params.studentId;
    const person=await Table.Person.findByPk(personId);
    res.render('ejs/common/edit-person',{title:'Edit student',person:person,link:'/admin/manage_student/edit',role:req.session.role})
}


exports.postEditstudent=async(req,res,next)=>{
    const name=req.body.name;
    const age=req.body.age;
    const phone=req.body.phone;
    const gender=req.body.gender;
    const email=req.body.email;
    const personId=req.body.personId;

    const person=await Table.Person.findByPk(personId);
    await person.set({name:name,age:age,email:email,phone:phone,gender:gender});
    await person.save();

    res.redirect('/admin/manage_student/list');
}

exports.deletestudent=async(req,res,next)=>{
    const personId=req.params.studentId;
    const person=await Table.Person.findByPk(personId);
    const student=await person.getStudent();
    const permission=await person.getPermission();
    const login=await person.getLogin();
    if(login.user==req.session.user){
        funcs.allow(res,'are you creazy , not allow delete your self !!');
        return;
    }
 
    await student.destroy();
    await login.destroy();
    await permission.destroy();
    await person.destroy();
    
    // you need reload this page just !!
    res.redirect('/admin/manage_student/list');
}

exports.getSelectstudentPage=async(req,res,next)=>{
    const students=await Table.Person.findAll({where:{role:'student'}});
    res.render('ejs/admin/manage-student/select-student',{title:'Select a student',students:students})
}
exports.getregisterPage=async(req,res,next)=>{
    const personId=req.params.studentId;
    const student=await Table.Student.findOne({where:{personId:personId}});
    const teachers=await Table.Teacher.findAll();
    const valible=[];
    for(let teacher of teachers){
        const subjects=await teacher.getSubjects();
        const teacherName=await (Table.Person.findByPk(teacher.personId));
        if(subjects) valible.push([teacher,teacherName.name,subjects]);
    }
    let did=funcs.toList(await student.getSubjects());
    let temp={};
    for(d of did)temp[d.name]=d.registartion.teacherId;
    did=temp;
    // we tryin get the teacherId from register taple
    res.render('ejs/admin/manage-student/register',{title:'register Subject To You',valible:valible,did:did,studentId:student.id})
}
// exports.getregisterPage=async(req,res,next)=>{
//     const personId=req.params.studentId;
//     const student=await Table.Student.findOne({where:{personId:personId}});
//     console.log("qqqqqqqqqqqqqqqqqqq ",personId,student);
//     let did=await student.getSubjects();
//     if(typeof did!=typeof [])did=[did];

//     let temp={};
//     for(d of did)temp[d.name]=true;

//     did=temp;
//     const subjects=await Table.Subject.findAll();
//     res.render('ejs/admin/manage-student/register',{title:'register Subject To You',subjects:subjects,did:did,studentId:student.id})
// }

exports.postregisterPage=async(req,res,next)=>{
    const studentId=req.params.studentId;
    const nselected=funcs.toList(req.body.nselected);
    const selected=funcs.toList(req.body.selected);
    // delete the non selected subject -was selected but in this page is non-
    for(let data of nselected){
        if(!data) continue;
        const [teacherId,subjectCode]=data.split(',');
        const reg=await Table.Registartion.findOne({where:{studentId:studentId,teacherId:teacherId,subjectCode:subjectCode}});
        if (reg) {
            await reg.destroy();
        }

    }
    
    // put mark and store the subjects are curent reg in this student
    const registartions=await Table.Registartion.findAll({where:{studentId:studentId}});
    const same={},usedSubjects={};
    for(let reg of registartions){
        usedSubjects[reg.subjectCode]=true;
        same[[reg.studentId,reg.teacherId,reg.subjectCode]]=true;
    }
    
    const setSubject={};
    for(let data of selected){
        if(!data) continue;
        const [teacherId,subjectCode]=data.split(',');
        if(same[[studentId,teacherId,subjectCode]]) continue;

        if(!setSubject[subjectCode])setSubject[subjectCode]=1;
        else setSubject[subjectCode]++;
        if(setSubject[subjectCode]==2){
            funcs.allow(res,'this you choosed a subject in more than one time in multi teacher !!');
            return;
        }

        if(usedSubjects[subjectCode]){
            funcs.allow(res,'this you choosed a subject in more than one time in multi teacher !!');
            return;
        }
    }
    for(let data of selected){
        if(!data) continue;
        const [teacherId,subjectCode]=data.split(',');

        const date=(new Date()).toISOString().split('T')[0];
        const registartion=await Table.Registartion.create({date:date,teacherId:teacherId,studentId:studentId,subjectCode:subjectCode});
        await registartion.createGrade();
        await registartion.createAttendance();
        await registartion.save();
    }


    res.redirect('/admin/manage_student');
}



