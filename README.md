# 🧈 PUFFIQUE | Bite. Sip. Bliss.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Google Apps Script](https://img.shields.io/badge/Google_Apps_Script-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/apps-script)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

> A modern tribute to the golden ratio of butter and brew. Premium Bun Maska & Chai in Bhubaneswar.

PUFFIQUE is a fully dynamic, premium bakery e-commerce and showcase website. It features a bespoke, dark-themed UI paired with a **completely custom headless CMS** built entirely on **Google Sheets**.

![PUFFIQUE Preview](https://raw.githubusercontent.com/ab-aswini/Puffique/main/public/products/bun-maska.png) 
*(Assume image above represents the brand - swap with actual hero shot)*

---

## ✨ Features

- **Pristine Dark Mode UI:** A gorgeous, bespoke design built with raw CSS. Fast, accessible, and stunning. Look out for the cursor-following floating physics on the homepage.
- **Dynamic Content (CMS):** The **entire website**—from hero titles and "About Us" story cards to the product menu and store locations—is controlled dynamically.
- **Bespoke Admin Dashboard (`/admin`):**
  - **Inventory:** Full CRUD (Create, Read, Update, Delete) for products. Includes image URL links and instant "Out of Stock" toggles.
  - **Leads:** View customer contact inquiries, cycle their status (`New` → `Contacted` → `Closed`), and instantly launch a pre-filled WhatsApp chat.
  - **Stores:** Edit your physical outlet locations, opening hours, descriptions, and Google Maps links.
  - **Content:** 15+ live text fields that dictate the copy seen by customers on the frontend.
  - **Announcements:** Toggle an animated global banner bar for offers/news.
- **Zero-Database Backend:** Uses **Google Sheets + Google Apps Script** as a lightning-fast, highly accessible, zero-cost database and CMS backend.

---

## 🛠 Tech Stack

**Frontend:**
* React 18
* Vite
* Vanilla CSS (No bulky frameworks, pure optimized styling)
* Lucide React (Icons)
* React Router DOM v6

**Backend & Database:**
* Google Sheets
* Google Apps Script (REST API / Webhook)

---

## 🚀 Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/Ab-aswini/Puffique.git
cd Puffique
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the dev server
```bash
npm run dev
```
The app will be running at `http://localhost:5173`.

---

## 📝 Setting up the Google Sheets CMS

This project requires a Google Sheet to act as the database. Follow these steps to deploy your completely free backend:

1. **Create a New Google Sheet**
   Go to [sheets.new](https://sheets.new).

2. **Open Apps Script**
   Click on `Extensions` > `Apps Script` in the top menu.

3. **Paste the Code**
   Delete any code currently in the script editor and paste the entire contents of the `GoogleAppsScript.js` file (found in the root of this repo).

4. **Initialize the Sheets**
   - At the top of the editor, select the `setupSheets` function from the dropdown.
   - Click the **Run** (▷) button.
   - Authorize the script when Google prompts you (you may need to click *Advanced* > *Go to script*).
   - This will instantly generate 4 properly formatted sheets: `Products`, `Leads`, `Locations`, and `Settings`, filled with sample dummy data.

5. **Deploy the Web App**
   - Click the blue **Deploy** button > **New deployment**.
   - Select type **Web app**.
   - Under *Execute as*, select **Me**.
   - Under *Who has access*, select **Anyone**.
   - Click **Deploy**.

6. **Connect the App**
   - Copy the generated `Web app URL`.
   - Open `src/utils/api.js` in this codebase.
   - Replace the `WEBHOOK_URL` variable at the top with your URL:
     ```javascript
     const WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_ACTUAL_ID/exec';
     ```

*Note: Whenever you make changes to the Google Apps Script code, you must create a **New Deployment** for the changes to take effect.*

---

## 🔐 Admin Access

To access the admin panel, navigate to `/admin` in your browser. 
By default, the protective PIN is: **`1234`**

*(You can change this PIN at the top of `src/pages/Admin.jsx`)*

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Ab-aswini/Puffique/issues).

---

Built with ❤️ for Bhubaneswar's finest Bun Maska.
