exports.getLink=(req,res,next)=>{
    const role=req.session.role;
    res.redirect(`/`);
}