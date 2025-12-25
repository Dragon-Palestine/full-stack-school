const Table=require('../../util/include')
const funcs=require('../../util/funcs')
const em=[{},{}]

// exports.getHomePage=(req,res,next)=>{
//     const role=req.session.role;
//     if(role!='student'){
//         funcs.allow(res,'you`re not a student !!');
//         return;
//     }

//     res.render('ejs/student/home',{title:'Home Page'});
// }

exports.getSubjects=async(req,res,next)=>{
  const role=req.session.role;
  if(role!='student'){
    funcs.allow(res,'you are not a student !!');
    return;
  }
    const personId=req.session.personId;
    const student=await Table.Student.findOne({where:{personId:personId}});
    const registartions = await student.getRegistartions();
    //funcs.getPro(registartions);
    const subjects=await Promise.all(registartions.map(reg=>reg.getSubject()));
    for(let sub of subjects){
          const reg=await Table.Registartion.findOne({where:{studentId:student.id,subjectCode:sub.code}});
          const teacher=await reg.getTeacher();
          const studentsCount=await teacher.countRegistartions({where:{subjectCode:sub.code}});
          sub['studentsCount']=studentsCount;
    }
    res.render('ejs/student/home',{title:'My Subjects',subjects:subjects});
}

exports.handelSubjectAction=(req,res,next)=>{
    let action=req.body.action;
    if(action=='attendance')action+='/chooseDate';
    const subjectCode=req.body.subjectCode;
    res.redirect(`/student/subject/${action}/${subjectCode}`);
}
exports.getGrade=async(req,res,next)=>{
    const subjectCode=req.params.subjectCode;
    const student=await Table.Student.findOne({where:{personId:req.session.personId}});
    const registartions=await student.getRegistartions({where:{subjectCode:subjectCode}});
    const registartion=registartions[0];
    const grade=await registartion.getGrade();

    res.render('ejs/common/grade',{title:'My Grade',grade:grade,subjectCode:subjectCode,mod:'read',role:req.session.role});
}
// exports.chooseDate=(req,res,next)=>{
//     const subjectCode=req.params.subjectCode;
//     res.render('ejs/common/attendance',{title:"Choose a Date",subjectCode:subjectCode});
// }
// exports.getAttendance=async(req,res,next)=>{
//     const subjectCode=req.body.subjectCode;
//     const date=9;
//     const [year,month]=date;
//     const person = await Table.Person.findByPk(req.session.personId);
//     const student=await person.getStudent();
//     const registartions=student.getRegistartions({where:{subjectCode:subjectCode}});
//     const registartion=registartions[0];
//     const attendance=await registartion.getAttendance();
//     const allDayTrue=attendance.getDate({where:{year:year,month:month}});
    
//     res.render('ejs/common/attendance',{title:'Attendance',visit:allDayTrue,mod:'read'});
// }

exports.chooseDate=async(req,res,next)=>{
    const subjectCode=req.params.subjectCode;
    const person=await Table.Person.findByPk(req.session.personId);
    const student=await person.getStudent();
    const studentId=student.id;

    res.render('ejs/common/choose_date_attendance',{title:'Choose a Date',subjectCode:subjectCode,studentId:studentId,link:`/student/subject/attendance/chooseDate/${subjectCode}`,role:req.session.role});
}

exports.getAttendance = async (req, res, next) => {
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
    link:'/student/subject/attendance',
    mod:'read',
    role:req.session.role,
  });
};

exports.postAttendanceStudent = async (req, res) => {
    res.redirect(`/student/subjects`);
};
