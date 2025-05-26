const axios = require("axios");
const db = require("../config/db.js");
const fs = require("fs");
const path = require("path");

// Đọc prompt: hướng dẫn + schema
const askPrompt = fs.readFileSync(path.join(__dirname, "../prompts/askPrompt.txt"), "utf-8");

exports.sendMessage = async (req, res) => {
    const userMessage = req.body.message;
    try {
        // Gửi yêu cầu sinh SQL
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "tngtech/deepseek-r1t-chimera:free",
                messages: [
                    {
                        role: "system",
                        content: "Bạn là chatbot học vụ trường UIT, chuyên sinh truy vấn SQL từ câu hỏi tự nhiên."
                    },
                    {
                        role: "user",
                        content: `${askPrompt}\n\nCâu hỏi: "${userMessage}"`
                    }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "HTTP-Referer": "/",
                    "X-Title": "UIT Chatbot",
                    "Content-Type": "application/json"
                }
            }
        );
        console.log("Full OpenRouter response:", JSON.stringify(response.data, null, 2));

        // Lấy phản hồi AI
        const content = response.data.choices?.[0]?.message?.content;
        console.log("AI raw reply:", content);

        // Parse JSON từ response
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return res.json({ reply: "Không phân tích được!!" });

        let parsed;
        try {
            parsed = JSON.parse(jsonMatch[0]);
        } catch (err) {
            console.error("Lỗi parse JSON:", err);
            return res.json({ reply: "Không phân tích được!!" });
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
        const explain = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "tngtech/deepseek-r1t-chimera:free",
                messages: [
                    {
                        role: "system",
                        content: "Bạn là chatbot học vụ, hãy trả lời bằng tiếng Việt rõ ràng, thân thiện dựa vào kết quả SQL và câu hỏi."
                    },
                    {
                        role: "user",
                        content: `Câu hỏi: "${userMessage}"\nKết quả SQL:\n${JSON.stringify(rows, null, 2)}`
                    }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "HTTP-Referer": "/",
                    "X-Title": "UIT Chatbot",
                    "Content-Type": "application/json"
                }
            }
        );

        const finalReply = explain.data.choices?.[0]?.message?.content || "Không diễn giải được kết quả.";
        res.json({ reply: finalReply.trim(), debug: parsed.note });

    } catch (err) {
        console.error("API Error:", err.response?.data || err.message);
        res.status(500).json({ reply: "Lỗi API" });
    }
};
