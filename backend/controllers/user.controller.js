
exports.test = (req,res)=>{
    res.status(200).json({
        status:'success',
        data : 'hello from server my server'
    })
}