# Deploy ke Railway

## Langkah-langkah Deploy

### 1. Persiapan
- Pastikan kode sudah di-push ke GitHub repository
- Daftar akun di [Railway.app](https://railway.app) (bisa login dengan GitHub)

### 2. Deploy dari Railway Dashboard

1. Login ke Railway dan klik **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. Pilih repository aplikasi DramaCina ini
4. Railway akan otomatis mendeteksi konfigurasi dan mulai build

### 3. Konfigurasi Environment Variables (Opsional)

Jika aplikasi menggunakan environment variables, tambahkan di Railway:
- Buka project di Railway
- Klik tab **"Variables"**
- Tambahkan variables yang diperlukan

### 4. Deploy

Railway akan otomatis:
- Install dependencies (`npm install`)
- Build aplikasi (`npm run build`)
- Start server (`npm start`)

### 5. Akses Aplikasi

Setelah deploy selesai:
- Railway akan memberikan URL public (format: `https://[nama-project].up.railway.app`)
- Aplikasi sudah live dan bisa diakses!

## Troubleshooting

### Build Gagal
- Cek logs di Railway dashboard
- Pastikan semua dependencies terdaftar di `package.json`

### Port Issues
- Railway otomatis mengatur PORT environment variable
- Server sudah dikonfigurasi untuk menggunakan `process.env.PORT`

### Redeploy
- Setiap push ke GitHub akan trigger automatic redeploy
- Atau manual redeploy dari Railway dashboard

## Fitur Railway

- ✅ Automatic HTTPS
- ✅ Custom domain support
- ✅ Auto-scaling
- ✅ Built-in monitoring
- ✅ Free tier available

## Alternative: Deploy via Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```
