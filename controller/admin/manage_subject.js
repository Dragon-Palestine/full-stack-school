
const Table=require('../../util/include')
const funcs=require('../../util/funcs')
const em=[{},{}]
exports.getManageSubjectPage=async (req,res,next)=>{
    const permission=req.session.permission;
    if(!permission.manageSubject){
        funcs.allow(res);
        return;
    }
    res.render('ejs/admin/manage-subject/home',{title:'Manage Subject',subjects:[{}]});
}
exports.getAddSubjectPage=(req,res,next)=>{
    res.render('ejs/admin/manage-subject/add',{title:'Add Subject'})
}

exports.postAddSubjectPage=async(req,res,next)=>{
    const name=req.body.name;
    const code=req.body.code;
    const hours=req.body.hours;
    let isFound;
    isFound=await Table.Subject.findByPk(code);
    if(isFound){
        funcs.allow(res,'This Code Is Already Exist');
        return;
    }
    isFound=await Table.Subject.findOne({where:{name:name}});
    if(isFound){
        funcs.allow(res,'This Name Is Already Exist');
        return;
    }

    const subject=await Table.Subject.create({name:name,code:code,hours:hours});
    res.redirect('/admin/manage_subject/list');
}

exports.getListSubjectPage=async(req,res,next)=>{
    const subjects=await Table.Subject.findAll();
    res.render('ejs/admin/manage-subject/list',{title:'Subjects',subjects:subjects})

}
exports.getEditSubjectPage=async(req,res,next)=>{
    const subjectCode=req.params.subjectCode;
    const subject=await Table.Subject.findByPk(subjectCode);

    res.render('ejs/admin/manage-subject/edit',{title:'Edit Subject',subject:subject})
}
exports.postEditSubjectPage=async(req,res,next)=>{
    const name=req.body.name;
    const code=req.body.code;
    const hours=req.body.hours;
    const preCode=req.body.preCode;
    const preName=req.body.preName;

    // if thair something exist
    let isFound;
    isFound=code!=preCode && await Table.Subject.findByPk(code);
    if(isFound){
        funcs.allow(res,'This Code Is Already Exist');
        return;
    }
    isFound=name!=preName && await Table.Subject.findOne({where:{name:name}}) ;
    if(isFound){
        funcs.allow(res,'This Name Is Already Exist');
        return;
    }
    
    const subject=await Table.Subject.findByPk(preCode);
    await subject.set({code:code,name:name,hours:hours});
    await subject.save();

    res.redirect('/admin/manage_subject/list');

}
exports.deleteSubject=async(req,res,next)=>{
    const subjectCode=req.params.subjectCode;
    const subject=await Table.Subject.findByPk(subjectCode);
    await subject.destroy();
    res.redirect('/admin/manage_subject/list');
}