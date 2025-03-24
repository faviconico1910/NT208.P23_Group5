const path = require("path");
const huongdan = (req,res)=>{
    res.sendFile(path.join(__dirname,"../../Frontend/huongdandkhp.html"))
}
module.exports = {huongdan};