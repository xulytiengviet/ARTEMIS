# ARTEMIS — Phòng mô phỏng tác tử điều khiển Android (tiếng Việt)

Trang giới thiệu và mô phỏng trực quan quy trình **một tác tử AI thực hiện nhiều thao tác trên điện thoại Android**. Giao diện được viết hoàn toàn bằng tiếng Việt (ngoại trừ tên riêng và nhãn thương hiệu), nền đen, điện thoại nằm ở trung tâm và các bảng theo dõi ở hai bên.

## Xem trang web

Khi GitHub Pages được kích hoạt: **https://xulytiengviet.github.io/ARTEMIS/**

## Kịch bản đang trình diễn

> Mở Google Maps, thiết lập các chặng lái xe tại TP.HCM, tính tổng thời gian di chuyển. Sau đó mở YouTube và phát một bài hát của Coldplay.

1. Tiếp nhận yêu cầu.
2. Mở giao diện Google Maps mô phỏng.
3. Nhập Dinh Độc Lập → Chợ Bến Thành → Landmark 81 → Sân bay Tân Sơn Nhất, chọn ô tô.
4. Hiển thị thời lượng mẫu của ba chặng: 8, 19 và 27 phút.
5. Cộng tổng: **54 phút**.
6. Chuyển sang giao diện YouTube và tìm **Coldplay – A Sky Full of Stars**.
7. Mở trình phát video chính thức từ YouTube. Người xem bấm **Phát** để yêu cầu phát video; trình duyệt quyết định có hỗ trợ nhúng hay không.

**Quan trọng:** Toàn bộ thời gian lái xe và giao diện Google Maps là **dữ liệu/kịch bản mô phỏng**. Đây không phải lưu lượng giao thông thời gian thực hoặc ứng dụng Google Maps đang hoạt động. Có liên kết mở tuyến trong Google Maps thật để đối chiếu.

## Các chức năng

- Điện thoại Android trực quan: trạng thái, thanh thông báo, màn hình ứng dụng, vùng cảm ứng.
- Nút chạy/tạm dừng, lùi/tiến từng bước, chạy lại, tốc độ 1× / 2× / 3×.
- Có thể bấm các mục của bảng tiến độ hoặc các nút trong điện thoại.
- Nhật ký hành động và tiến trình cập nhật theo kịch bản.
- Phần tổng kết 3 chặng và sao chép kết quả.
- Chạy dưới dạng trang tĩnh, không yêu cầu tài khoản, API key, ADB, máy chủ hay công cụ biên dịch.
- Thiết kế đáp ứng trên máy tính và điện thoại.

## Cách chạy nhanh

Tải repository và mở tệp \`index.html\` trong trình duyệt hiện đại. Trang chỉ gồm \`index.html\`, \`styles.css\` và \`app.js\`.

## Kích hoạt GitHub Pages

Workflow \`.github/workflows/pages.yml\` đã được chuẩn bị để triển khai tự động.

1. Truy cập **Settings → Pages** của repository này.
2. Ở **Build and deployment → Source**, chọn **GitHub Actions**.
3. Vào thẻ **Actions → Triển khai trang ARTEMIS → Run workflow** để kích hoạt lại nếu cần.
4. Đợi Actions thông báo triển khai thành công và truy cập địa chỉ Pages ở trên.

Việc tạo workflow **không có nghĩa** là GitHub Pages đã được bật. Cần chọn nguồn triển khai trong Settings lần đầu.

## Phân biệt bản trình diễn và ARTEMIS thật

Dự án gốc: https://github.com/google/artemis

ARTEMIS thật có thể tự động hóa trên thiết bị Android được kết nối với hệ thống điều khiển (ADB/thiết bị mô phỏng, dịch vụ tác tử và các công cụ liên quan). Trang trong repository này **không** kết nối thiết bị Android, không điều khiển Google Maps hay YouTube trên điện thoại và không ghi nhận thao tác thời gian thực. Đây là **bản trình diễn giáo dục được xây dựng độc lập** để minh họa luồng thực thi mà ARTEMIS có thể đảm nhận khi cấu hình đầy đủ.

Để chạy ARTEMIS thật, tham khảo tài liệu và hướng dẫn cài đặt chính thức tại repository gốc.

## Nguồn video

Video chính thức của Coldplay: https://www.youtube.com/watch?v=VPRjCeoBqrI

Video chỉ được tải qua YouTube khi người xem chủ động nhấn nút phát trong màn hình cuối. Nếu chủ video hoặc YouTube giới hạn tính năng nhúng, có thể mở YouTube trong thẻ mới.

## Bảo mật và quyền riêng tư

- Không thu thập seed phrase, mật khẩu, dữ liệu ví, ảnh màn hình hay thông tin tài khoản.
- Không yêu cầu đăng nhập.
- Không có mã theo dõi phân tích.
- Không gọi API kiểm soát thiết bị.
- Liên kết bên ngoài: GitHub, Google Maps và YouTube; kết nối nhúng YouTube chỉ được kích hoạt sau tương tác của người xem.

**Bản mô phỏng không liên kết, không được tài trợ hoặc bảo trợ bởi Google hay YouTube.** Tên ứng dụng và tên nhạc chỉ dùng để mô tả kịch bản.
