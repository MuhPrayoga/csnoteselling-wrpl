# UTAMANKAN PULL

## Langkah-langkah running:

- conda info --envs <!-- cek info env -->
- conda activate WRPL <!-- aktifkan env (yg terinstal flask) -->

### BE (terminal 1):

- cd backend
- run pip install -r requirements.txt <!-- Cek apakah sdh install depedensi untuk backend -->
- python app.py <!-- Jalankan backend -->

### FE (terminal 2):

- cd frontend
- npm install <!--cek apakah dependensi sdh terinstall sesuai package.json  -->
- npm run watch <!-- Jalankan tailwindcss -->

# Perubahan baru:

- Buat file .env di folder backend kalian, lalu isi dengan:
  DATABASE_URL=mysql://root:YHtIPFbrYOuawzOkzApwjTCatBRzVyDh@centerbeam.proxy.rlwy.net:11729/railway
