## git pull dulu

## Langkah-langkah running:

- conda info --envs <!-- cek info env -->
- conda activate WRPL <!-- aktifkan env (yg terinstal flask) -->

# BE (terminal 1):

- cd backend
- run pip install -r requirements.txt <!-- Cek apakah sdh install depedensi untuk backend -->
- python app.py

# FE (terminal 2):

- cd frontend
- npm install <!--cek apakah dependensi sdh terinstall sesuai package.json  -->
- npm run watch

## Perubahan baru:

- Buat file .env di folder backend kalian, lalu isi dengan: DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=
  DB_NAME=noteselling-wirpl
  SECRET_KEY=
