# 🍼 GrowNest

GrowNest is a comprehensive, full-stack child health and development tracking application designed to help parents effortlessly manage their child's medical records, vaccination schedules, and growth metrics. It features a state-of-the-art AI assistant tailored exclusively for pediatric and parenting advice.

---

## 🚀 Live Demo
* **(Vercel):** [https://grow-nest-web.vercel.app/](https://grow-nest-web.vercel.app/)

> ⚠️ **IMPORTANT NOTE FOR JUDGES / TESTERS:** 
> The backend servers and the AI microservice are hosted on **Render's Free Tier**. To save resources, Render automatically puts these servers to "sleep" after 15 minutes of inactivity. 
> 
> **When you first log in, upload a file, or send your first AI message, it may take 50-60 seconds for the servers to "wake up" and respond.** Please be patient on your very first interaction! After the initial 60-second wake-up phase, the application will respond instantly.

---

## ✨ Key Features
* **GrowNest AI Assistant:** A custom-built AI chatbot (powered by Groq & LLaMA 3.3) that streams specialized, medical-grade advice on child nutrition, sleep, vaccinations, and parenting.
* **Medical Records Vault:** Securely upload, store, and manage PDFs and images of prescriptions, growth charts, and medical reports.
* **Smart Vaccination Tracker:** Automatically generates a personalized vaccination schedule based on the child's date of birth and tracks upcoming and missed shots.
* **Multi-Child Profiles:** Parents can seamlessly add and manage multiple children under a single account.

---

## 🏗️ Tech Stack & Architecture

This project is built using a modern microservice architecture:

* **Frontend UI:** React.js, Tailwind CSS *(Hosted on Vercel)*
* **Main API Backend:** Node.js, Express.js *(Hosted on Render)*
* **AI Microservice:** Python, FastAPI, Groq API *(Hosted on Render)*
* **Database:** MySQL Cloud Database *(Hosted on Aiven)*

### Why Microservices?
By completely separating the Node.js database backend from the Python AI backend, the application ensures that heavy AI processing streams do not block standard API requests (like file uploads or user authentication), mirroring true enterprise-level scalability!

---

## 🛠️ Local Development Setup

If you want to run this project locally on your machine:

**1. Clone the repository**
```bash
git clone https://github.com/AJ987-geek/GrowNest-web.git
cd GrowNest-web
``` 

**2. Start the React Frontend**
```bash
cd GrowNest-Frontend
npm install
npm run dev
```
**3. Start the Node.js Backend**
```bash
cd GrowNest-Backend
npm install
node server.js
```
**Start the Python AI Microservice**
```bash
cd GrowNest-AI
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 10000
```
5. Database Configuration This project requires a MySQL database. To run it locally:

Create a .env file inside the GrowNest-Backend folder.
Add your database credentials like this: DB_HOST=your_host DB_PORT=your_port DB_USER=your_user DB_PASSWORD=your_password DB_NAME=your_database
Import the provided database_backup.sql file into your MySQL database to build the tables.
