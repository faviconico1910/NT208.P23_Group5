
    for label in soup.find_all("th"):  # Giả sử tiêu đề nằm trong thẻ <th>
        next_td = label.find_next("td")  # Tìm ô <td> chứa giá trị tương ứng
        if next_td and next_td.text.strip():
            student_info[label.text.strip()] = next_td.text.strip()
    
    return student_info
