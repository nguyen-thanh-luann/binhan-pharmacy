# Next.js E-commerce Website

## This is a modern e-commerce website built using Next.js, designed to provide users with a seamless shopping experience. It showcases a wide range of products, including best-sellers, trending items, and highly searched products.

### 1. Product Showcase: Displays a curated selection of products, including best-sellers, trending items, and most searched products.

### 2. Product Search: Allows users to search for specific products based on keywords or filters.

### 3. Product Details: Provides detailed information about each product, along with related products and bundled items.

### 4. Online Ordering and Payment: Enables users to place orders online and choose from multiple payment options including Cash on Delivery (COD) and VNPAY.

### The ROLE of user account 'npp' is just use for the admin who have permission to create, edit and delete post in website. Dont change the account_type if user is not an admin.

### custom color variable
#### this source use Antd & tailwindcss -> some class of both library will be disbled -> go to these file to custom your style or find style customed:

- tailwind.config.js
- variables.scss

## Getting Started

1. First, install node_modules

```bash
yarn
# or
npm i
```
2. Then create .env.local file located at the same level as the src folder with the following environment variables (create your own variables's value)

* NEXT_PUBLIC_API_URL
* NEXT_PUBLIC_IMAGE_DOMAIN_URL
* NEXT_PUBLIC_DOMAIN_URL
* NEXT_PUBLIC_CHAT_API_URL
* NEXT_PUBLIC_SECRET_KEY
* NEXT_PUBLIC_ZALO_OA_ID
* NEXT_PUBLIC_FACEBOOK_PAGE_ID
* NEXT_PUBLIC_FACEBOOK_APP_ID


* NEXT_PUBLIC_API_KEY
* NEXT_PUBLIC_AUTH_DOMAIN
* NEXT_PUBLIC_PROJECT_ID
* NEXT_PUBLIC_STORAGE_BUCKET
* NEXT_PUBLIC_MESSAGING_SENDER_ID

* NEXT_PUBLIC_TINY_EDITOR_KEY

3. Run the project
```bash
yarn dev
# or
npm run dev
```

Open http://localhost:3000 with your browser to see the result.
