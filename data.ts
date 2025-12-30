import { MindMapData } from './types';

export const initialData: MindMapData = {
  id: 'root',
  label: 'KẾ HOẠCH TÀI CHÍNH',
  icon: 'Activity',
  description: 'Chiến lược toàn diện: Tích lũy - Đầu tư - Phát triển bản thân.',
  content: 'Kế hoạch này được xây dựng dựa trên nguyên tắc 50/30/20 và lãi suất kép. \n\nMục tiêu cốt lõi:\n1. Đạt sự an toàn tài chính trong 1 năm.\n2. Đạt độc lập tài chính vào năm 35 tuổi.\n3. Xây dựng dòng tiền thụ động bền vững.',
  isExpanded: true,
  images: [
    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=600"
  ],
  children: [
    {
      id: '1',
      label: '1. Mục Tiêu Tài Chính',
      icon: 'Target',
      description: 'Định hướng rõ ràng cho lộ trình 1-5 năm tới.',
      content: 'Thiết lập mục tiêu theo nguyên tắc SMART (Cụ thể, Đo lường được, Khả thi, Liên quan, Có thời hạn). \nViệc chia nhỏ mục tiêu giúp giảm áp lực và dễ dàng theo dõi tiến độ.',
      isExpanded: true,
      images: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400"],
      children: [
        {
          id: '1-1',
          label: 'Ngắn Hạn (0-1 Năm)',
          icon: 'CheckCircle2',
          description: 'Mục tiêu: 10 Triệu VND.',
          content: 'Chi tiết ngân sách cần thiết:\n- Mua laptop cũ để học lập trình: 8.000.000đ\n- Quỹ dự phòng khẩn cấp ban đầu: 2.000.000đ\n\nKế hoạch hành động:\n- Tiết kiệm: 800k/tháng từ tiền tiêu vặt.\n- Làm thêm: 500k/tháng (bán đồ cũ, chạy grab part-time).',
          images: ["https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400"]
        },
        {
          id: '1-2',
          label: 'Dài Hạn (1-5 Năm)',
          icon: 'TrendingUp',
          description: 'Mục tiêu: 100 Triệu VND.',
          content: 'Mục đích sử dụng vốn:\n- Vốn khởi nghiệp quán cafe nhỏ hoặc Shop Online (70tr).\n- Quỹ đầu tư chứng khoán dài hạn (30tr).\n\nChiến lược:\n- Tận dụng lãi suất kép.\n- Tái đầu tư toàn bộ lợi nhuận từ các kênh phụ.',
          images: ["https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400"]
        },
        {
            id: '1-3',
            label: 'Phi Tài Chính',
            icon: 'Activity',
            description: 'Phát triển bản thân & Kỹ năng.',
            content: 'Đầu tư vào bản thân là khoản đầu tư sinh lời nhất.\n\nCác kỹ năng cần đạt:\n1. Tiếng Anh: IELTS 6.5 (để tiếp cận tài liệu nước ngoài).\n2. Tư duy tài chính: Hiểu về Báo cáo tài chính, Chu kỳ kinh tế.\n3. Kỹ năng số: Excel nâng cao, PowerBI.',
            images: ["https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=400"],
            links: [
                { label: 'Lộ trình học IELTS', url: 'https://ielts.org' },
                { label: 'Kiến thức chứng khoán cơ bản', url: 'https://investopedia.com' }
            ]
        }
      ]
    },
    {
      id: '2',
      label: '2. Tài Chính Hiện Có',
      icon: 'Wallet',
      description: 'Đánh giá trung thực nguồn lực hiện tại.',
      content: 'Bước đầu tiên của quản lý tài chính là biết mình đang đứng ở đâu. Cần lập Bảng Cân Đối Kế Toán cá nhân: Tài sản vs Nợ.',
      images: ["https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=400"],
      children: [
        {
          id: '2-1',
          label: 'Tiền Mặt & Dòng Tiền',
          description: 'Tiền mặt sẵn có và thu nhập hàng tháng.',
          content: 'Hiện trạng:\n- Tiền mặt trong ví: 500k.\n- Tiền trong thẻ ATM: 1.5tr.\n- Thu nhập cố định (trợ cấp/lương): 3tr/tháng.\n\nNhận xét: Dòng tiền còn yếu, phụ thuộc vào một nguồn thu.',
          images: ["https://images.unsplash.com/photo-1621981386829-9b458a2cddde?auto=format&fit=crop&q=80&w=400"]
        },
        {
          id: '2-2',
          label: 'Tiết Kiệm & Tích Lũy',
          description: 'Các khoản dự phòng an toàn.',
          content: '- Sổ tiết kiệm ngân hàng số (Cake/Timo): 5 triệu (Lãi suất 6%/năm).\n- Heo đất: 2 triệu.\n\nTổng quỹ tích lũy: 7 triệu (Đủ chi tiêu cơ bản trong 2 tháng).',
          images: ["https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&q=80&w=400"]
        },
        {
            id: '2-3',
            label: 'Tài Sản Quy Đổi',
            description: 'Đồ đạc có thể thanh lý.',
            content: 'Danh sách đồ không dùng:\n1. Truyện tranh cũ: Ước tính 500k.\n2. Quần áo cũ (còn mới 90%): Ước tính 400k.\n3. Bàn phím cơ cũ: 600k.\n\nTổng khả năng thanh khoản: ~1.5 triệu.',
            images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400"],
            links: [{ label: 'Nhóm thanh lý đồ cũ', url: 'https://chotot.com' }]
        }
      ]
    },
    {
      id: '3',
      label: '3. Nghiên Cứu Thị Trường',
      icon: 'PieChart',
      description: 'Tìm kiếm cơ hội sinh lời an toàn.',
      content: 'Phân tích các kênh đầu tư phù hợp với số vốn nhỏ (<10 triệu). Không tham gia các kênh rủi ro cao như Forex, Crypto khi chưa có kiến thức.',
      images: ["https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400"],
      children: [
        {
          id: '3-1',
          label: 'Kênh An Toàn (Defensive)',
          description: 'Gửi tiết kiệm, Vàng.',
          content: '- Gửi tiết kiệm: An toàn tuyệt đối, lãi thấp (5-6%). Phù hợp quỹ khẩn cấp.\n- Vàng nhẫn: Chống lạm phát tốt. Mua tích trữ mỗi khi có dư 1 chỉ (khoảng 6-7tr).',
          images: ["https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=400"]
        },
        {
          id: '3-2',
          label: 'Kinh Doanh Nhỏ (Aggressive)',
          description: 'Bán hàng online, Dropshipping.',
          content: 'Mô hình Dropshipping:\n- Ưu điểm: Không cần vốn nhập hàng, không lo tồn kho.\n- Nhược điểm: Cạnh tranh cao, biên lợi nhuận thấp.\n- Nền tảng: Shopee, TikTok Shop.',
          images: ["https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=400"]
        },
        {
          id: '3-3',
          label: 'Đầu Tư Kỹ Năng (Value)',
          description: 'Freelance jobs.',
          content: 'Học các kỹ năng high-demand để nhận job:\n1. Thiết kế Slide PowerPoint/Canva.\n2. Edit Video ngắn (CapCut/TikTok).\n3. Viết Content SEO.\n\nThu nhập tiềm năng: 100k - 500k/job.',
          images: ["https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=400"],
          links: [{label: 'Tìm việc Freelance', url: 'https://vlance.vn'}]
        }
      ]
    },
    {
      id: '4',
      label: '4. Phân Bổ Vốn',
      icon: 'PieChart',
      description: 'Quy tắc 50/30/20.',
      isExpanded: false,
      content: 'Nguyên tắc JARS hoặc 50/30/20 giúp cân bằng giữa tận hưởng cuộc sống hiện tại và đảm bảo tương lai.',
      images: ["https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400"],
      children: [
        {
          id: '4-1',
          label: '50% Nhu Cầu Thiết Yếu',
          description: 'Chi phí sinh tồn.',
          content: 'Bao gồm:\n- Tiền ăn: 1.5tr\n- Xăng xe/Đi lại: 300k\n- Điện thoại/4G: 100k\n\nNếu vượt quá 50%, cần xem xét cắt giảm hoặc tìm cách tăng thu nhập ngay lập tức.',
          images: ["https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"]
        },
        {
          id: '4-2',
          label: '30% Mong Muốn',
          description: 'Giải trí, mua sắm, cafe.',
          content: 'Khoản này giúp duy trì động lực làm việc.\n- Cafe bạn bè.\n- Mua quần áo mới.\n- Đăng ký Netflix/Spotify.\n\nLưu ý: Có thể cắt giảm khoản này để dồn cho mục Tích lũy nếu có mục tiêu gấp.',
          images: ["https://images.unsplash.com/photo-1512418490979-92798cec1380?auto=format&fit=crop&q=80&w=400"]
        },
        {
          id: '4-3',
          label: '20% Tích Lũy & Đầu Tư',
          description: 'Trả cho bản thân trước.',
          content: 'Đây là khoản "BẤT KHẢ XÂM PHẠM".\nNgay khi nhận lương/thu nhập, trích ngay 20% vào tài khoản tiết kiệm riêng biệt.\n- 10% Quỹ khẩn cấp.\n- 10% Quỹ đầu tư.',
          images: ["https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&q=80&w=400"]
        }
      ]
    },
    {
      id: '5',
      label: '5. Hành Động Cụ Thể',
      icon: 'Activity',
      description: 'Các bước thực thi hàng ngày.',
      isExpanded: false,
      images: ["https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=400"],
      children: [
        {
          id: '5-1',
          label: 'Quản Lý Thu Chi',
          description: 'Ghi chép kỷ luật.',
          content: 'Thói quen nhỏ, tác động lớn:\n- Ghi lại TẤT CẢ khoản chi, dù chỉ 5k gửi xe.\n- Cuối tuần dành 15p review lại xem tuần qua đã phung phí ở đâu.\n- Sử dụng App MoneyLover hoặc Excel.',
          images: ["https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400"]
        },
        {
          id: '5-2',
          label: 'Gia Tăng Thu Nhập',
          description: 'Đa dạng hóa nguồn thu.',
          content: '- Chủ động xin tăng ca/nhận thêm trách nhiệm (nếu đi làm).\n- Nhận 2 project freelance/tháng.\n- Dọn dẹp nhà cửa, thanh lý đồ cũ định kỳ mỗi quý.',
          images: ["https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?auto=format&fit=crop&q=80&w=400"]
        },
        {
            id: '5-3',
            label: 'Tiết Kiệm Thông Minh',
            description: 'Lối sống tối giản.',
            content: 'Tiết kiệm không phải là hà tiện, mà là chi tiêu thông minh để tối ưu hóa giá trị đồng tiền.\n\nPhương pháp Kakeibo (Nhật Bản):\n1. Bạn có bao nhiêu tiền?\n2. Bạn muốn tiết kiệm bao nhiêu?\n3. Bạn sẽ tiêu bao nhiêu?\n4. Bạn có thể cải thiện điều gì?\n\nTư duy Minimalism (Tối giản): Chỉ sở hữu những gì thực sự mang lại niềm vui hoặc giá trị sử dụng cao. Giảm bớt đồ đạc giúp giảm stress và chi phí bảo trì.',
            images: ["https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=400"],
            children: [
                { 
                    id: '5-3-1', 
                    label: 'Tiết kiệm điện/nước', 
                    description: 'Tắt đèn, kiểm tra rò rỉ.',
                    content: '- Thay bóng đèn LED tiết kiệm điện.\n- Tận dụng ánh sáng tự nhiên.\n- Giặt đồ khi đủ lồng giặt.',
                    images: ["https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=400"]
                },
                { 
                    id: '5-3-2', 
                    label: 'Mua sắm thông minh', 
                    description: 'Săn sale, so sánh giá.',
                    content: '- Áp dụng quy tắc "30 ngày": Khi thích món gì đắt tiền, đợi 30 ngày. Nếu vẫn muốn mua thì mới mua.\n- So sánh giá trên 3 sàn TMĐT trước khi chốt đơn.',
                    images: ["./lang_phi.jpg"]
                },
                { 
                    id: '5-3-3', 
                    label: 'Ăn uống tại nhà', 
                    description: 'Tự nấu ăn.',
                    content: '- Tự nấu ăn giúp tiết kiệm 40-50% so với ăn ngoài.\n- Đảm bảo vệ sinh an toàn thực phẩm.\n- Mang cơm đi làm/đi học.',
                    images: ["./ngon.jpg"] 
                }
            ]
        }
      ]
    },
    {
      id: '6',
      label: '6. Dự Toán & Gọi Vốn',
      icon: 'Calculator',
      description: 'Kế hoạch cho dự án kinh doanh đầu tiên.',
      content: 'Mô phỏng kế hoạch kinh doanh bán đồ ăn vặt online.',
      images: ["https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&q=80&w=400"],
      children: [
        {
          id: '6-1',
          label: 'Chi Phí Ban Đầu (CAPEX)',
          description: 'Vốn cố định.',
          content: 'Tổng vốn cần: 3.000.000đ\n- Nguyên liệu đợt đầu: 2.000.000đ\n- Bao bì, logo, in ấn: 500.000đ\n- Chạy quảng cáo Facebook test thị trường: 500.000đ',
          images: ["https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=400"]
        },
        {
          id: '6-2',
          label: 'Dự Báo Dòng Tiền',
          description: 'Kịch bản doanh thu.',
          content: '- Tháng 1: Bán cho người quen -> Hoà vốn.\n- Tháng 2: Khách hàng quay lại + Giới thiệu -> Lãi 10%.\n- Tháng 3: Mở rộng kênh TikTok -> Lãi 20%.\n\nĐiểm hòa vốn (Break-even point): Bán được 50 đơn hàng.',
          images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400"]
        },
        {
          id: '6-3',
          label: 'Huy Động Vốn',
          description: 'Nguồn vốn bên ngoài.',
          content: 'Nếu vốn tự có không đủ:\n1. Vay gia đình: Lãi suất 0%, cam kết trả gốc sau 6 tháng.\n2. Rủ bạn bè hùn vốn: Chia sẻ rủi ro và lợi nhuận (cần hợp đồng rõ ràng).\n3. Vay thấu chi (Cẩn trọng lãi suất cao).',
          images: ["https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&q=80&w=400"]
        }
      ]
    }
  ]
};