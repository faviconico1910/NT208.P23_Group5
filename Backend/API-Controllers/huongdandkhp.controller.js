const path = require("path");
const huongdan = (req,res)=>{
    res.sendFile(path.join(__dirname,"../../Frontend/Huongdandkhp/huongdandkhp.html"))
}
module.exports = {huongdan};