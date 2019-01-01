var multer  = require('multer')
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,process.cwd()+"/uploads/")
    },
    filename:function (req,file,cb) {
        cb( null, req.files[0].fieldname+"-"+req.query.regno+".pdf");
    }
})

module.exports.upload=multer({ storage : storage });
