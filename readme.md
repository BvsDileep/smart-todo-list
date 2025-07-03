# Smart Todo List 📝

A **smart, AI-assisted Todo List** that helps you manage your daily tasks by automatically suggesting task priorities based on urgency and description.

---

## ✨ Features

* Add, edit, delete tasks
* Automatically suggests **priority (High/Medium/Low)** using AI (HuggingFace API)
* Tracks deadlines and statuses
* Clean, responsive frontend (Next.js + Tailwind)
* REST API backend (Node.js + Express + Prisma + SQLite)
* Designed for learning and practical daily use

---

## 🛠️ Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** Prisma ORM with SQLite
* **AI Priority Suggestion:** HuggingFace Inference API

---

## 🚀 How to Start the Project

### 1️⃣ Start the Backend

**Go to the backend folder:**

```bash
cd backend
```

**Install dependencies:**

```bash
npm install
```

**Set up environment variables:**

* Create a `.env` file.
* Add your HuggingFace API key:

```ini
HF_API_TOKEN=your_huggingface_api_key
```

**Push Prisma schema and generate DB:**

```bash
npx prisma migrate dev --name init
```

**Start the backend:**

```bash
npm run dev
```

The backend will run at:

```
http://localhost:4000
```

---

### 2️⃣ Start the Frontend

**Open a new terminal.**

**Navigate to the frontend folder:**

```bash
cd frontend
```

**Install dependencies:**

```bash
npm install
```

**Start the frontend:**

```bash
npm run dev
```

The frontend will run at:

```
http://localhost:3000
```

---

## ⚡ Note on AI Priority Suggestion

This project uses **HuggingFace Inference API** to automatically suggest **priority (High, Medium, Low)** for your tasks based on the title and description.

**Since HuggingFace free tier API calls can take a long time**, a **fallback priority function** is implemented:

* If the API call fails or times out (>15 seconds), the system will still suggest a priority locally based on keywords and deadline, ensuring your workflow remains fast.

---

## ✅ Usage

1. Open the app in your browser: [http://localhost:3000](http://localhost:3000)
2. Add tasks with Title, Description, and Deadline.
3. The app will automatically suggest **priority**.
4. Track and complete your tasks easily.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss your proposed changes.

---

## 📄 License

This project is open for educational and practical productivity use. Free to use and modify.

---

Built with ❤️ to make your task management smarter and faster.
