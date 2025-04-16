const axios = require("axios");
const db = require("../config/db.js");
exports.sendMessage = async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "deepseek/deepseek-r1:free",
                messages: [
                    {
                        role: "system", 
                        content: `
                            Bạn là một trợ lý học vụ thông minh cho sinh viên trường Đại học UIT. Dưới đây là sơ lược cơ sở dữ liệu của bạn, bao gồm các bảng:

- SINHVIEN (Ma_Sinh_Vien, Ho_Ten, Gioi_Tinh, Ngay_Sinh, Noi_Sinh, Tinh_Trang, Nam_Nhap_Hoc,Ma_Lop, Ma_Khoa, Ma_Nganh, He_Dao_Tao, Email_Truong, Email_Ca_Nhan, Dien_Thoai, So_CMND, Ngay_Cap_CMND, Noi_Cap_CMND, Dan_Toc, Ton_Giao, Xuat_Than, Ngay_Vao_Doan, Ngay_Vao_Dang, Ho_Ten_Cha, Nghe_Nghiep_Cha, SDT_Cha, Ho_Ten_Me, Nghe_Nghiep_Me, SDT_Me, Ho_Ten_Bao_Ho, Thuong_Tru, Quan_Huyen, Phuong_Xa, Tinh_Tp, Dia_Chi_Tam_Tru, Dia_Chi_Cha, Dia_Chi_Me, Dia_Chi_Bao_Ho)
- MONHOC (Khoa, Ma_Nganh, Ma_Mon_Hoc, Ten_Mon_Hoc, Hoc_Ki, Tin_chi_LT, Tin_chi_TH, Ma_Mon_Tien_Quyet)
- MONHOC_KHAC (Khoa, Ma_Nganh, Ma_Mon_Hoc, Ten_Mon_Hoc, Tin_chi_LT, Tin_chi_TH, Loai) 
- DANGKY (Ma_Sinh_Vien, Ma_Mon_Hoc, Ma_Lop_Hoc)
- LICHHOC (Ma_Lop_Hoc, Thu, Tiet_Bat_Dau, Tiet_Ket_Thuc) 
- KETQUA (Ma_Sinh_Vien, Hoc_Ky, Ma_Mon_Hoc, Diem_QT, Diem_GK, Diem_TH, Diem_CK, Diem_HP, GHI_CHU)
- NGANH (Ma_Nganh, Ten_Nganh, So_Tin_Chi, Ma_Khoa, Mo_Ta)
- LOP (Ma_Lop, Ten_Lop, So_Luong, Co_Van_Hoc_Tap)
- GIANGVIEN (Ma_Giang_Vien,Ho_Ten,Gioi_Tinh,Ngay_Sinh,Noi_Sinh,Ma_Khoa,Email_Truong,Email_Ca_Nhan,Dien_Thoai,So_CMND,Ngay_Cap_CMND,Noi_Cap_CMND,Dan_Toc,Ton_Giao,Xuat_Than,Ngay_Vao_Doan,Ngay_Vao_Dang,Ho_Ten_Cha,Nghe_Nghiep_Cha,SDT_Cha,Ho_Ten_Me,Nghe_Nghiep_Me,SDT_Me,Thuong_Tru,Quan_Huyen,Phuong_Xa,Tinh_Tp,Dia_Chi_Tam_Tru,Hoc_Vi, Hoc_Ham, He_So ,Muc_Luong)
- KHOA (Ma_Khoa, Ten_Khoa, Ma_Truong_Khoa)

1. Phân tích ý định.
2. Sinh câu truy vấn SQL (MySQL).
3. TRẢ VỀ DUY NHẤT MỘT JSON hợp lệ, không thêm bất kỳ văn bản nào trước hay sau. 
Chỉ đúng định dạng:
{
  "sql": "<Câu truy vấn SQL>",
  "note": "<Giải thích câu truy vấn>"
}
Ví dụ:
{
  "sql": "SELECT ...",
  "note": "Câu này lấy cố vấn học tập của lớp..."
}
Nếu không hiểu, trả về JSON với sql rỗng:
{
  "sql": "",
  "note": "Không thể xác định truy vấn phù hợp."
}
`
                    }, 
                    { role: "user", content: userMessage }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "HTTP-Referer": "http://localhost",
                    "X-Title": "UIT Chatbot",
                    "Content-Type": "application/json"
                }
            }
        );
        // parse sql
        const bot_Reply = response.data.choices?.[0]?.message?.content || "{}";
        let parsed;
        const match = bot_Reply.match(/\{[\s\S]*\}/);
        if (!match) return res.json({ reply: "Không phân tích được!!" });
        try {
            parsed = JSON.parse(match[0]);
        } catch (err)
        {
            return res.json({ reply: "Không phân tích được!!"});
        }
        
        const sql = parsed.sql;

        // execute
        const [rows] = await db.query(sql);

        if (rows.length === 0)
            return res.json({reply: "Không có kết quả phù hợp với bạn!"});


        const explainResponse = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "deepseek/deepseek-r1:free",
                messages: [
                    {
                        role: "system",
                        content: `
Bạn là trợ lý học vụ UIT. Dựa vào kết quả truy vấn SQL và câu hỏi gốc của người dùng, hãy viết câu trả lời tiếng Việt thân thiện và dễ hiểu.
Tránh lặp lại từ "dưới đây là kết quả", trả lời như một con người thực tế.
                        `
                    },
                    {
                        role: "user",
                        content: `
Câu hỏi người dùng: "${userMessage}"
Kết quả SQL: ${JSON.stringify(rows, null, 2)}
                        `
                    }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "HTTP-Referer": "http://localhost",
                    "X-Title": "UIT Chatbot",
                    "Content-Type": "application/json"
                }
            }
        );

        const finalReply = explainResponse.data.choices?.[0]?.message?.content || "Không diễn giải được kết quả.";

        res.json({ reply: finalReply, debug: parsed.note });
    } catch (err) {
        console.error("API Error:", err.response?.data || err.message);
        res.status(500).json({ reply: "Lỗi API" });
    }
};