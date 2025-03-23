const path = require("path");
const huongdan = (req,res)=>{
    res.sendFile(path.json(__dirname,"huongdandkhp.html"))
}
module.exports = {huongdan};