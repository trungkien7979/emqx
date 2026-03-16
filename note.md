1. Đầu tiên là publish nó đóng vai trò là iot ảo bắn dữ liệu như nhiệt đồ, độ ẩm ngẫu nhiên 
2. Bắn dữ liệu từ publisher lên MQTT Broker
3. server Nestjs đóng vai trò là trung gian nhận dữ liệu từ MQTT Broker và gửi qua WebSocket
4. file test-websocket.html hiển thị client 