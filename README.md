# 🥗 NutriTrace Frontend — Supply Chain Transparency App

Frontend untuk **NutriTrace**, platform pelacakan rantai pasok pangan yang menghadirkan transparansi dari asal bahan hingga distribusi akhir ke konsumen. Dibangun dengan **Next.js 14 (App Router)** dan **TailwindCSS + ShadCN UI** untuk antarmuka yang cepat, rapi, dan mudah dikembangkan.

🔗 **Live Frontend:** https://nutri-trace.vercel.app/  
🔗 **Frontend Repository:** https://github.com/bayufadayan/nutri-trace-app-frontend  
🔗 **Backend (API) Live:** https://nutri-trace-backend.bayufadayan.my.id/  
🔗 **Backend Repository:** https://github.com/bayufadayan/nutri-trace-app-backend

---

## 📘 Project Title
**NutriTrace Frontend**

---

## 📝 Description
NutriTrace memudahkan pengguna menelusuri **asal bahan, proses pengolahan, distribusi**, hingga **informasi gizi** tiap produk. Melalui antarmuka web yang responsif, pengguna dapat **scan/masukkan kode** (atau QR code di sisi backend) untuk melihat detail batch dan nilai gizi produk, serta memantau alur rantai pasok secara transparan.

---

## 🧰 Technologies Used
- **Next.js 15 (App Router)** — SSR/ISR, performa cepat
- **TypeScript** — type-safe & maintainable
- **Tailwind CSS** — styling utility-first, cepat & konsisten
- **ShadCN UI** — komponen UI siap pakai dan dapat dikustom
- **React Hook Form + Zod** — form + validasi skema yang solid
- **Recharts** — visualisasi data gizi/distribusi
- **ESLint & Prettier** — menjaga kualitas dan konsistensi kode

---

## ✨ Features
| Fitur | Deskripsi |
| --- | --- |
| **Product & Batch Trace** | Lihat asal bahan, proses, dan distribusi berdasarkan kode/batch |
| **Nutrition Panel** | Tampilkan nilai gizi (kalori, protein, karbo, lemak) per produk |
| **Search/Trace by Code** | Halaman trace yang menerima kode produk/batch |
| **Data Visualization** | Grafik (Recharts) untuk tren/komposisi gizi |
| **Responsive UI** | Desain modern dengan Tailwind + ShadCN |
| **No-Store Fetching** | Mengambil data fresh dari API backend |

> Catatan: Scan QR dilakukan pada sisi backend (generator/handler). Frontend menampilkan data yang diambil via API.

---

## ⚙️ Setup Instructions

### 1) Clone & Install
```bash
git clone https://github.com/bayufadayan/nutri-trace-app-frontend.git
cd nutri-trace-app-frontend
npm install

```
### 2) Environment Variables
```env
API_BASE=
NEXT_PUBLIC_API_BASE=
ACCESS_TOKEN_MAXAGE=86400
REFRESH_TOKEN_MAXAGE=2592000
APPLICATION_MODE="DEMO"

```

### 3) Run (Development)
```bash
# Development
npm run dev

```
### 4) Build & Start (Production)
```bash
npm run build
npm start

```
Server default: http://localhost:3000

---

## 🧭 Struktur Direktori (ringkas)
```bash
ntar dulu

```
Catatan: Skema & daftar endpoint lengkap dapat dilihat pada https://nanti.com

---
## 🧠 AI Support Explanation
Pengembangan backend dibantu IBM Granite 3.3:2b via Ollama untuk:
- Menyusun boilerplate halaman dan komponen UI (ShadCN)
- Merapikan validasi form (React Hook Form + Zod)
- Membantu refactor & perbaikan saat debugging

---

## 🚀 Deployment (Vercel)
1. Push repo ke GitHub: bayufadayan/nutri-trace-app-frontend
2. Import ke Vercel
3. Tambahkan Environment Variables:
  - API_URL = https://nutri-trace-backend.bayufadayan.my.id
4. Deploy → aplikasi akan tersedia di https://nutri-trace.vercel.app/

---

## 📝 License
MIT License

---

## 🔗 Related Links
- Frontend Live: https://nutri-trace.vercel.app/
- Frontend Repo: https://github.com/bayufadayan/nutri-trace-app-frontend
  
- Backend Live: https://nutri-trace-backend.bayufadayan.my.id/
- Backend Repo: https://github.com/bayufadayan/nutri-trace-app-backend
  
- Dokumentasi/Media: https://drive.google.com/drive/folders/1otM2QtGHR8jDnluKCaphZTZsuhg5tpsp?usp=sharing

---

<p align="center"> </p> <p align="center"> <a href="https://github.com/bayufadayan"> <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white"/> </a> <a href="https://www.linkedin.com/in/muhamad-bayu-fadayan/"> <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white"/> </a> <a href="https://bayufadayan.my.id/"> <img src="https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=vercel&logoColor=white"/> </a> <a href="https://drive.google.com/file/d/1fPClIxWKbeaKyArwL9cSIDmOFeT-tBt2/view?usp=drive_link"> <img src="https://img.shields.io/badge/CURICULUM%20VITAE-4285F4?style=for-the-badge&logo=googledrive&logoColor=white"/> </a> </p> <p align="center"> Made with ❤️ by <a href="https://github.com/bayufadayan">Bayu Fadayan</a><br/> <img src="https://img.shields.io/badge/Year-2025-blue?style=flat-square"/> <img src="https://img.shields.io/badge/Role-Backend%20Developer-purple?style=flat-square"/><br/><br/> <a href="https://github.com/bayufadayan/nutri-trace-app-frontend"> <img src="https://img.shields.io/badge/Go%20to%20this%20repository-000000?style=flat-square&logo=github&logoColor=white"/> </a> </p>
