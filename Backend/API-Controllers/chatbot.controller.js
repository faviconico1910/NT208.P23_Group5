require("dotenv").config
const axios = require("axios");
const db = require("../config/db.js");
const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require('@google/generative-ai');

// khởi tạo
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// Đọc prompt: hướng dẫn + schema
const askPrompt = fs.readFileSync(path.join(__dirname, "../prompts/askPrompt.txt"), "utf-8");

exports.sendMessage = async (req, res) => {
    const userMessage = req.body.message;
    console.log("User message:", userMessage);
    try {

       // Gộp sinh SQL và diễn giải trong 1 request
        const prompt = `
            Bạn là chatbot học vụ UIT. Dựa trên câu hỏi và schema, thực hiện:
            1. Tạo truy vấn SQL MySQL an toàn.
            2. Diễn giải kết quả trong reply, dùng {{results}} làm placeholder.
            3. Trả về JSON: { "sql": "<SQL>", "note": "<Giải thích>", "reply": "Đây là kết quả: {{results}}" }
            Lưu ý: Reply chỉ chứa văn bản với {{results}}, không chứa bảng markdown hay JSON thô.
            ${askPrompt}
            Câu hỏi: "${userMessage}"
        `;
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });

        // Lấy phản hồi từ Gemini
        const content = result.response.text();
        console.log("Gemini raw response:", content);


    // Parse JSON
        let parsed;
        try {
            parsed = JSON.parse(content);
            if (!parsed.sql || !parsed.note || !parsed.reply) {
                throw new Error("JSON thiếu sql, note, hoặc reply");
            }
        } catch (err) {
            console.error("Lỗi parse JSON:", err.message, "Raw content:", content);
            return res.json({ reply: "Không phân tích được câu trả lời từ AI!" });
        }
        
        let rows;
        try {
            [rows] = await db.query(parsed.sql);
            console.log("SQL result:", JSON.stringify(rows, null, 2));
        } catch (dbErr) {
            console.error("Lỗi truy vấn SQL:", dbErr.message, "SQL:", parsed.sql);
            return res.json({ reply: "Lỗi khi truy vấn cơ sở dữ liệu!" });
        }

        if (rows.length === 0)
            return res.json({ reply: "Không có kết quả phù hợp với bạn!" });

        // Diễn giải kết quả
        let finalReply;
        if (rows.length === 0) {
            finalReply = "Xin lỗi, mình không tìm thấy thông tin phù hợp. Bạn muốn hỏi gì thêm không?";
        } else {
            const formattedTable = formatResults(rows).trim();
            finalReply = parsed.reply
                .replace(/\s*{{results}}\s*/g, `\n${formattedTable}`)
                .replace(/\n{3,}/g, "\n\n"); // Giới hạn tối đa 2 xuống dòng liên tiếp
            
            // Thêm phần tổng kết nếu có
            if (parsed.reply.includes("📊")) {
                finalReply += "\n" + parsed.reply.split("📊")[1];
            }
            
            // Đảm bảo tiêu đề không bị mất
            if (!finalReply.includes('📘')) {
                finalReply = "📘 Dưới đây là kết quả học tập:\n\n" + finalReply;
            }
        }

        res.json({ reply: finalReply.trim(), debug: parsed.note });

    } catch (err) {
        console.error("API Error:", err.response?.data || err.message);
        res.status(500).json({ reply: "Lỗi API" });
    }
};
// hàm định dạng kq
function formatResults(rows) {
    if (!rows.length) return "Không tìm thấy kết quả.";

    if (rows[0].Ten_Mon_Hoc) {
        // Lọc các môn học duy nhất
        const uniqueSubjects = [];
        const seenSubjects = new Set();
        
        rows.forEach(row => {
            if (!seenSubjects.has(row.Ten_Mon_Hoc)) {
                seenSubjects.add(row.Ten_Mon_Hoc);
                uniqueSubjects.push(row);
            }
        });

        // Tạo chuỗi kết quả với khoảng cách hợp lý
        let result = "Dựa trên thông tin mình có, đây là danh sách các môn học bạn đã học:\n\n";
        
        uniqueSubjects.forEach(subject => {
            result += `- ${subject.Ten_Mon_Hoc}\n`;
        });
        
        return result;
    }
    
    return rows.map(row => Object.entries(row).map(([key, val]) => `${key}: ${val ?? "N/A"}`).join(", ")).join("\n");
}