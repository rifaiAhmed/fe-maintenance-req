# Maintenance Request Log — Frontend

Frontend aplikasi Maintenance Request Log yang dibangun dengan Vue 3, TypeScript, Vite, dan Vue Router. Image production dibangun secara multi-stage dan hasil build dilayani oleh Nginx.

## Menjalankan dengan Docker Compose

### Prasyarat

- Docker Engine
- Docker Compose v2 (`docker compose`)
- Backend Maintenance Request Log tersedia di `http://localhost:9001`

Tidak perlu memasang Node.js atau Nginx di host.

### Menjalankan aplikasi

Dari direktori frontend, jalankan:

```bash
docker compose up --build
```

Setelah container berstatus sehat, buka:

- Frontend: http://localhost:5176
- Backend API default: http://localhost:9001/api

Untuk menjalankan di background:

```bash
docker compose up --build -d
```

Lihat status dan log container:

```bash
docker compose ps
docker compose logs -f frontend
```

Hentikan aplikasi:

```bash
docker compose down
```

## Konfigurasi

Konfigurasi default sudah tersedia di `docker-compose.yml`, sehingga aplikasi bisa langsung dibangun tanpa membuat file `.env`.

| Variabel | Default | Keterangan |
|---|---|---|
| `FRONTEND_PORT` | `5173` | Port frontend yang diekspos pada host |
| `VITE_API_URL` | `http://localhost:9001/api` | URL API yang ditanam ke bundle saat image dibangun |

Untuk menggunakan nilai lain, salin file contoh:

```bash
cp .env.example .env
```

Kemudian ubah `.env`, misalnya:

```env
FRONTEND_PORT=8080
VITE_API_URL=https://api.example.com/api
```

Karena `VITE_API_URL` merupakan build-time variable Vite, image harus dibangun ulang setelah nilainya berubah:

```bash
docker compose up --build -d
```

Jika `FRONTEND_PORT` atau domain frontend diubah, pastikan origin tersebut juga diizinkan oleh konfigurasi CORS backend.

## Verifikasi

Periksa kesehatan container:

```bash
docker compose ps
```

Uji respons frontend:

```bash
curl --fail http://localhost:5173/
```

Konfigurasi Nginx menggunakan fallback ke `index.html`, sehingga URL Vue Router seperti `/login`, `/dashboard`, dan `/requests` tetap dapat dibuka atau di-refresh secara langsung.

## Struktur Docker

- `Dockerfile`: membangun bundle Vue dengan Node.js, lalu menyajikannya menggunakan Nginx.
- `docker-compose.yml`: membangun image, memetakan port, dan menjalankan container.
- `nginx.conf`: konfigurasi static hosting, cache asset, dan fallback SPA.
- `.dockerignore`: mengecilkan build context dan mencegah file lokal ikut masuk image.
- `.env.example`: contoh konfigurasi yang dapat disalin menjadi `.env`.

## Pengembangan Lokal Tanpa Docker

Cara ini opsional dan membutuhkan Node.js yang kompatibel.

```bash
npm ci
npm run dev
```

Build production lokal:

```bash
npm run build
```
