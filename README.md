Personal Financial Management System
Project Description

A full-stack personal financial management system designed to help users manage income and expenses, control budgets, and visualize financial data. The system integrates AI-based bill recognition to reduce manual input and improve efficiency.


Tech Stack
Backend
Java 17, Spring Boot
MyBatis-Plus, MySQL
JWT Authentication
Apache POI (Excel export)
Aliyun OSS (file storage)
Frontend
Vue 3 (Composition API), Vite
Element Plus
Pinia (state management)
Axios
ECharts (data visualization)
Key Features
User authentication and role management
Income and expense tracking with hierarchical categories
Budget management with real-time usage tracking and warning alerts
Financial data visualization (trend charts, category analysis, rankings)
AI bill recognition from uploaded images
File upload and media handling via cloud storage
Admin dashboard for platform-level statistics
System Architecture
Client–Server architecture
Frontend communicates with backend via RESTful APIs
Backend handles business logic, authentication, and database operations
Data stored in a structured relational database
Getting Started
Backend
cd PersonalFinancialManagement.springboot
./mvnw spring-boot:run

Backend runs at:
http://localhost:7351

Frontend
cd PersonalFinancialManagement.elementui
npm install
npm run dev

Open:
http://localhost:8080

Notes
JWT is used for authentication and validated via interceptor
Budget is automatically updated when new transactions are recorded
AI recognition results are parsed and stored for further processing
System supports both admin and normal user roles

如果你下一步想更狠👇
我可以帮你做：

👉 把这个改成 一段“华为/大厂风格项目经历”（中文）
👉 或写一版 面试讲稿（你直接背） 😏
