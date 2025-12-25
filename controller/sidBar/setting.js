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

    let objLogin={user:userName,password:password};
    if(formPasswordIsEmpty && !formUserIsEmpty) objLogin={user:userName};
    else if(formUserIsEmpty && !formPasswordIsEmpty)objLogin={password:password};
    else if(formUserIsEmpty && formPasswordIsEmpty)objLogin={user:login.user,password:login.password};

    await login.set(objLogin);
    await login.save();

    console.log(formPasswordIsEmpty,formUserIsEmpty,objLogin,login);

    res.redirect(`/${req.session.role}`);
}