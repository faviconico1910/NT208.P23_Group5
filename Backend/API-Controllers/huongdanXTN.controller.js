const { get } = require("http");
const path = require("path");
const getHuongDanXTN = (req,res)=>{
    res.sendFile(path.join(__dirname,"../../Frontend/HuongDanXetTotNghiep/huongdanXTN.html"))
}


module.exports = {getHuongDanXTN};