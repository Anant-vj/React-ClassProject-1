# 🚦 Venture Timings

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white&style=for-the-badge)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white&style=for-the-badge)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

**Venture Timings** is a high-performance, real-time transport scheduling dashboard built for modern commuters. With a focus on speed, clarity, and aesthetics, it provides live updates on arriving transport lines, ensuring you never miss a ride.

![Venture Timings Preview](venture_timings_mockup_png_1776599761085.png)

---

## ✨ Key Features

-   🔄 **Real-Time Data Sync**: Automatic 30-second polling to ensure schedule accuracy.
-   🌓 **Adaptive Dark Mode**: Seamlessly switch between light and dark themes with persistent user preferences.
-   📍 **Route Filtering**: Drill down into specific transport lines (Routes 1-5) to see only the data that matters.
-   🎯 **Smart Prioritization**: Automatically identifies and highlights the "Next" arrival for immediate visibility.
-   ⚡ **Ultra-Responsive**: Fully optimized for mobile, tablet, and desktop viewing experiences.
-   🎨 **Glassmorphic Design**: Modern UI aesthetic with smooth transitions, subtle gradients, and custom animations.

---

## 🛠️ Tech Stack

-   **Frontend Framework**: [React 19](https://reactjs.org/) (Hooks, Memoization, Custom State)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **API Integration**: Dynamic fetching with native `fetch` and async/await.
-   **State Management**: React Context/State for localized and global persistence.

---

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine:

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18.0.0 or higher)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Anant-vj/React-ClassProject-1.git
    cd React-ClassProject-1
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

4.  **Open in browser**
    Navigate to `http://localhost:5173` to see the app in action!

---

## 🏗️ Project Structure

```bash
├── public/          # Static assets
├── src/
│   ├── assets/      # Images, SVGs, and brand files
│   ├── App.jsx      # Core logic and Dashboard component
│   ├── App.css      # Custom styles and Tailwind extensions
│   ├── main.jsx     # App entry point
│   └── index.css    # Global resets
├── index.html       # Entry template
└── package.json     # Project configuration
```

---

## 🧪 Development Workflow

-   `npm run dev`: Launch the Vite development server.
-   `npm run build`: Generate a production-ready bundle.
-   `npm run lint`: Run ESLint checks for code quality.

---

## 🤝 Contribution

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/Anant-vj">Anant-vj</a>
</p>
