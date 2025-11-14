# Install Inertia server-side
composer require inertiajs/inertia-laravel

# Publish Inertia middleware
php artisan inertia:middleware

# Install dependencies frontend
npm install @inertiajs/react react react-dom
npm install @vitejs/plugin-react vite --save-dev

# Install Tailwind CSS sebagai dev dependency
npm install tailwindcss@latest @tailwindcss/vite @tailwindcss/postcss postcss

npm instll lucide-react

# Install shadcn/ui
npx shadcn@latest init

# Install components
npx shadcn@latest add alert
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add field
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add separator