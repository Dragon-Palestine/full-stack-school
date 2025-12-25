const Table=require('../../util/include')
const funcs=require('../../util/funcs');
const { where } = require('sequelize');
const { Op } = require('sequelize');
const include = require('../../util/include');
const student = require('../../models/student');

const em=[{},{}]

exports.getHomePage=async(req,res,next)=>{
    const role=req.session.role;
    if(role!='teacher'){
        funcs.allow(res,'you are not a teacher !!');
        return;
    }
    const personId=req.session.personId;
    const teacher=await Table.Teacher.findOne({where:{personId:personId}});
    let subjects=await teacher.getSubjects();
    for(let sub of subjects){
          const studentsCount=await teacher.countRegistartions({where:{subjectCode:sub.code}});
          sub['studentsCount']=studentsCount;
    }
    res.render('ejs/teacher/home',{title:'Manage Subject',subjects:subjects})
}

exports.getStudent=async(req,res,next)=>{
    const subjectCode=req.params.subjectCode;
    const personId=req.session.personId;
    const teacher=await Table.Teacher.findOne({where:{personId:personId}});
    const registartions=await teacher.getRegistartions({where:{subjectCode:subjectCode}});

    const students=[];
    for(let reg of registartions){
        const studentId=reg.studentId;
        const student=await Table.Student.findByPk(studentId);
        const person=await Table.Person.findByPk(student.personId);
        students.push(person);
    }
    res.render('ejs/teacher/student',{title:'Students',students:students,subjectCode:subjectCode,selectMode:false});
}

exports.getDeleteStudent=async(req,res,next)=>{
    const permission=req.session.permission;
    if(!permission.manageStudent){
      funcs.allow(res);
      return;
    }
    const subjectCode=req.params.subjectCode;
    const studentId=req.params.studentId;
    const personId=req.session.personId;
    const teacher=await Table.Teacher.findOne({where:{personId:personId}});
    const teacherId=teacher.id;

    const registartion=await Table.Registartion.findOne({teacherId:teacherId,studentId:studentId,subjectCode:subjectCode});
    await registartion.destroy();
    res.redirect(`/teacher/subject/student/${subjectCode}`);
}

exports.addStudentToSubject=async(req,res,next)=>{
    const permission=req.session.permission;
    if(!permission.manageStudent){
      funcs.allow(res);
      return;
    }
    const subjectCode=req.params.subjectCode;
    const students=await Table.Student.findAll({include:[{model:Table.Subject,where:{code:subjectCode},required:false}],where:{'$Subjects.code$':null}});
    
    const persons=[];
    for(let student of students){
        persons.push(await Table.Person.findByPk(student.personId))
    }
    res.render('ejs/teacher/student',{title:'Add a Student',students:persons,subjectCode:subjectCode,selectMode:true});
}

exports.saveStudentAfterAdd=async(req,res,next)=>{
    const subjectCode=req.params.subjectCode;
    const student=await Table.Student.findOne({where:{personId:req.params.studentId}});
    const studentId=student.id;
    const personId=req.session.personId;
    const teacher=await Table.Teacher.findOne({where:{personId:personId}});
    const teacherId=teacher.id;
    
    const grade=await Table.Grade.create();
    const attendance=await Table.Attendance.create();
    const date=(new Date()).toISOString().split('T')[0];
    const registartion=await Table.Registartion.create({date:date,teacherId:teacherId,studentId:studentId,subjectCode:subjectCode,attendanceId:attendance.id,gradeId:grade.id});
    
    res.redirect(`/teacher/subject/student/${subjectCode}`);
}

exports.getGradeStudent=async(req,res,next)=>{
    const permission=req.session.permission;
    if(!permission.manageGrade){
      funcs.allow(res);
      return;
    }
    const subjectCode=req.params.subjectCode;
    const personId=req.params.studentId;
    const teacher=await Table.Teacher.findOne({where:{personId:req.session.personId}});
    const teacherId=teacher.id;

    const student=await Table.Student.findOne({where:{personId:personId}});
    const registartion=await Table.Registartion.findOne({where:{studentId:student.id,teacherId:teacherId,subjectCode:subjectCode}});
    const grade=await registartion.getGrade();
    res.render('ejs/common/grade',{title:'Student Grade',grade:grade,subjectCode:subjectCode,studentId:student.id,mod:'write',role:req.session.role})
    
}

exports.postGradeStudent=async(req,res,next)=>{
    const subjectCode=req.body.subjectCode;
    const studentId=req.body.studentId;
    const teacher=await Table.Teacher.findOne({where:{personId:req.session.personId}});
    const teacherId=teacher.id;

    const mid=req.body.mid;
    const final=req.body.final;
    const hw=req.body.hw;

    const registartion=await Table.Registartion.findOne({where:{studentId:studentId,teacherId:teacherId,subjectCode:subjectCode}});
    const grade=await registartion.getGrade();
    await grade.set({mid:mid,final:final,hw:hw});
    await grade.save();
    res.redirect(`/teacher/subject/student/${subjectCode}`);


}
exports.getDateForStudent=async(req,res,next)=>{
    const permission=req.session.permission;
    if(!permission.manageAttendance){
      funcs.allow(res);
      return;
    }
    const subjectCode=req.params.subjectCode;
    const personId=req.params.studentId;
    const student=await Table.Student.findOne({where:{personId:personId}});
    const studentId=student.id;

    res.render('ejs/common/choose_date_attendance',{title:'Choose a Date',subjectCode:subjectCode,studentId:studentId,link:`/teacher/subject/attendance/${subjectCode}/${student.id}`,role:req.session.role});
}

exports.getAttendanceStudent = async (req, res, next) => {
  const date = req.body.date; // yyyy-mm
  const [year, month] = date.split('-').map(Number);

  const subjectCode = req.body.subjectCode;
  const studentId = req.body.studentId;

  const student = await Table.Student.findByPk(studentId);

  const registrations = await student.getRegistartions({
    where: { subjectCode }
  });

  const registration = registrations[0];
  const attendance = await registration.getAttendance();

  const records = await attendance.getAttendanceDates({
    where: { year, month }
  });

  const presentDays = records.map(r => r.day);

  const daysInMonth = new Date(year, month, 0).getDate();

  res.render('ejs/common/attendance', {
    title: 'Attendance',
    year,
    month,
    daysInMonth,
    presentDays,
    subjectCode,
    studentId,
    link:'/teacher/subject/attendance',
    mod:'write',
    role:req.session.role,
  });
};


// exports.getAttendanceStudent=async(req,res,next)=>{
//     const date=req.body.date;
//     const [year,month]=date.split('-').map(str=> +str);
//     const subjectCode=req.body.subjectCode;
//     const studentId=req.body.studentId;
//     const student=await Table.Student.findByPk(studentId);
//     const registartions=await student.getRegistartions({where:{subjectCode:subjectCode}});
//     const registartion=registartions[0];
//     const attendance=await registartion.getAttendance();
//     const allDayTrue=await attendance.getAttendanceDates({where:{year:year,month:month}});

//     res.render('ejs/common/attendance',{title:'Attendance',visit:allDayTrue,mod:'write'});

// }


exports.postAttendanceStudent = async (req, res) => {
  const { days,year,month,studentId,subjectCode} = req.body;
  const selectedDays = funcs.toList(days);

  const student = await Table.Student.findByPk(studentId);
  const registration = (await student.getRegistartions({ where:{subjectCode} }))[0];
  const attendance = await registration.getAttendance();

  const oldRecords = await attendance.getAttendanceDates({
    where: { year, month }
  });

  const oldDays = oldRecords.map(d => d.day);

  const removedDays = oldDays.filter(d => !selectedDays.includes(d));
  const addedDays   = selectedDays.filter(d => !oldDays.includes(d));

  for(let day of addedDays){
    await attendance.createAttendanceDate({day:day,month:month,year:year});
  } 
  for(let day of removedDays){
    (await Table.AttendanceDate.findOne({where:{day:day,month:month,year:year}})).destroy();
  } 
  res.redirect(`/teacher/subject/student/${subjectCode}`);
};

// exports.getDateAttendance=async(req,res,next)=>{
//     const subjectCode=req.params.subjectCode;
//     res.render('ejs/teacher/choose_date',{title:'Choose a day',subjectCode:subjectCode,link:'/teacher/subject/date'});
// }

// exports.getAttendanceStudents=async(req,res,next)=>{
//     const subjectCode=req.body.subjectCode;
//     const date=req.body.date;
//     const teacher=await Table.Teacher.findOne({where:{personId:req.session.personId}});
//     const teacherId=teacher.id;

//     // const student=await Table.Student.findOne({where:{personId:personId}});
//     const registartions=await Table.Registartion.findAll({where:{teacherId:teacherId,subjectCode:subjectCode}});
//     const data=[];

//     for(let reg of registartions){
//         const student=await Table.Student.findByPk(reg.studentId);
//         const person=await Table.Person.findByPk(student.personId);
//         const attendance=await reg.getAttendance();
//         const days=await attendance.getDays();
//         console.log(days);
//         //if(attendance) data.push({'student':person,'status':attendance.status});
//     }

//     if(!data.length){
//         funcs.allow(res,'no recorde in this day !!');
//         return;
//     }

//     res.render('ejs/teacher/attendance',{title:'Attendances',data:data});
    
// }

// exports.getGrades=async(req,res,next)=>{
//     const subjectCode=req.params.subjectCode;
//     const teacher=await Table.Teacher.findOne({where:{personId:req.session.personId}});
//     const teacherId=teacher.id;

//     const registartions=await Table.Registartion.findAll({where:{teacherId:teacherId,subjectCode:subjectCode}});
//     const grades=[];

//     for(let reg of registartions){
//         const grade=await reg.getGrade();
//         const studentId=reg.studentId;
//         const student=await Table.Student.findByPk(studentId);
//         const personId=student.personId;
//         const person=await Table.Person.findByPk(personId);
//         grades.push([person,grade]);
//     }

//     console.log(grades);
//     res.render('ejs/teacher/grades',{title:'Grades',grades:grades})

// }

