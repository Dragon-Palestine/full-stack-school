const Table=require('../../util/include')
const funcs=require('../../util/funcs');
const permission = require('../../models/permission');
const em=[{},{}]

exports.getSettingPage=async(req,res,next)=>{
    const personId=req.session.personId;
    const person=await Table.Person.findByPk(personId);
    const login=await person.getLogin();

    res.render('ejs/sidBar/setting',{title:'Setting',person:person,login:login,role:req.session.role});


}
exports.postSettingPage=async(req,res,next)=>{
    const {confirmPassword,password,oldPassword,email,gender,phone,age,name,userName,personId}=req.body;
    const person=await Table.Person.findByPk(personId);
    const login=await person.getLogin();
    
    const formPasswordIsEmpty=!password || !oldPassword || !confirmPassword;
    const formUserIsEmpty=!userName;

    const correctPassword=login.password;
    if(!formPasswordIsEmpty && (correctPassword!=oldPassword)){
        funcs.allow(res,'you write a wrong old password !!');
        return;
    }
    if(!formPasswordIsEmpty && (confirmPassword!=password)){
        funcs.allow(res,'no maches in password !!');
        return;
    }

    const foundUser=await Table.Login.findByPk(userName);

    if(!formUserIsEmpty && foundUser && (userName!=login.user)){
        funcs.allow(res,'we found another user has a same userName !!');
        return;
    }

    await person.set({name:name,age:age,email:email,phone:phone,gender:gender});
    await person.save();

    let objLogin=false;
    if(formPasswordIsEmpty && !formUserIsEmpty) objLogin={user:userName,password:login.password};
    else if(formUserIsEmpty && !formPasswordIsEmpty)objLogin={password:password,user:login.user};
    else if(formUserIsEmpty && formPasswordIsEmpty)objLogin={user:login.user,password:login.password};
    
    if(objLogin){
        if(person.id==1){
            funcs.allow(res,"not allowed change user or password the owner!!");
            return;
        }
        await login.destroy();
        await person.createLogin(objLogin);
        await person.save();
        req.session.user = objLogin.user; 
        req.session.password = objLogin.password;
    }
    
    res.redirect(`/${req.session.role}`);
}