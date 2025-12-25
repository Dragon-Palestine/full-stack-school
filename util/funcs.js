const Table=require('../util/include')
exports.getPermission=(bo)=>{
    return {
        manageAdmin:bo,
        manageTeacher:bo,
        manageStudent:bo,
        manageSubject:bo,
        manageGrade:bo,
        manageAttendance:bo,
        assignSubjectToTeacher:bo,
        assignSubjectToStudent:bo,
        managePermission:bo,
        }
}
exports.getPro=(table)=>{
    console.log(Object.getOwnPropertyNames(table.__proto__));
}
exports.toList=(data)=>{
    if(typeof data != typeof [])return [data];
    return data;
}
exports.allow=(res,message="you are not allow to accsess this page")=>{
    return res.render('ejs/allowed',{title:'allow message',message:message})
}
exports.addPerson=(req,role)=>{
    const name=req.body.name;
    const age=req.body.age;
    const phone=req.body.phone;
    const gender=req.body.gender;
    const email=req.body.email;
    return Table.Person.create({name:name,age:age,phone:phone,gender:gender,email:email,role:role});
}

exports.addLogin=(req)=>{
    const user=req.body.username;
    const pass=req.body.password;
    //console.log("hhhhhhhhhhhhhhhhhh",req.personId);
    return  Table.Login.create({user:user,password:pass});
}


exports.addPermission=async (permissions)=>{
    const per=await Table.Permission.create();
    //if(typeof permissions != typeof [])permissions=[permissions];
    for(p of permissions){
        per[p]=true;
    }
    return per.save();
}
