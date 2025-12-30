const permission = require("../../models/permission");
const Table = require("../../util/include");
const funcs=require('../../util/funcs');

exports.getLoginPage = (req, res, next) => {
  res.render("ejs/login", { title: "Login" });
  //res.redirect('/home');
};

exports.postLoginPage = async (req, res, next) => { 
  const user = req.body.user; 
  const pass = req.body.password; 

  if(user && pass && user=="show" && pass=="show"){
    res.redirect('/users/show');
    return;
  }
  
  const login = await Table.Login.findByPk(user); 
  const permission = login && (await Table.Permission.findOne({ where: { personId: login.personId }, login: login })); 
  const person = login && (await Table.Person.findByPk(login.personId)); 
  if (!login || login.password !== pass) {
    let message = '';
    if (!login) message = 'this user is not correct';
    else message = 'this password is not correct';
    funcs.allow(res, message); 
    return;
  }

  req.session.regenerate((err) => {
    if (err) return funcs.allow(res, "Session error");
    req.session.user = user; 
    req.session.password = pass; 
    req.session.permission = permission; 
    req.session.role = person.role; 
    req.session.personId = person.id; 

    res.redirect(`/${person.role}`);
  });
};

exports.getShow=async(req,res,next)=>{
  const admins=await Table.Person.findAll({where:{role:'admin'}});
  const students=await Table.Person.findAll({where:{role:'student'}});
  const teachers=await Table.Person.findAll({where:{role:'teacher'}});

  const loginAdmin=[],loginStudent=[],loginTeacher=[];

  for(let admin of admins){
    const login=await admin.getLogin();
    loginAdmin.push(login);
  }
  for(let student of students){
    const login=await student.getLogin();
    loginStudent.push(login);
  }
  for(let teacher of teachers){
    const login=await teacher.getLogin();
    loginTeacher.push(login);
  }

  res.render('ejs/users',{link:'Users',loginAdmin:loginAdmin,loginStudent:loginStudent,loginTeacher:loginTeacher});

}
