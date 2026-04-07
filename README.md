This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started For Developer (NICKO / PLANGTON)

First, run the development server:

```bash
npm install

npx prisma init

npx prisma generate
# for looking the database (optional)
# npx prisma studio

npm run dev
```

## Cara Membuat Branch untuk Push di Github

- Pertama, ajukan permintaan menjadi contributor 
- Salin Project ke folder lokal
- Lakukan perubahan atau update code
- Buat Branch Sendiri (misal perubaah dashboard) dan lakukan push
    ```bash
    git checkout -b feature/dashboard

    git add .
    
    git commit -m "add: dashboard"
    
    git pull origin feature/dashboard
    
    git push origin feature/dashboard
    ```
- Buat Pull Request di website github
- Pemilik repo ACC Request
- Collabolator lainnya bisa melihat perubahan di branch lain dengan cara
    ```bash
    #mengambil dan download branch lain
    git fetch --all
    
    #cek list branch
    git branch -a
    
    #masuk ke branch collabolator lain
    git checkout feature/dashboard

    #ambil perubahan yang ada di branch tersebut
    git pull origin feature/dashboard
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
