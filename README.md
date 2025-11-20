# Lenzro Luxe ✨

A premium fashion & clothing e-commerce platform with a stunning modern dark glassmorphic UI, featuring exclusive collections for men, women, and kids.

## ✨ Features

### 📊 Core Functionality

- **Fashion Collections** - Curated clothing collections for Men, Women, Kids & Accessories
- **Product Catalog** - Browse premium clothing with detailed size, color & material info
- **Smart Shopping** - Advanced filters, wishlist, and personalized recommendations
- **Size Guide & Fit** - Comprehensive size charts and fit recommendations
- **Style Inspiration** - Lookbook gallery, outfit suggestions & trending styles
- **Shopping Cart & Checkout** - Seamless shopping experience with secure payments
- **Order Tracking** - Real-time order status from placement to delivery
- **Customer Accounts** - Save favorites, track orders, and manage preferences
- **Admin Dashboard** - Comprehensive inventory, sales, and analytics management
- **Staff Portal** - Efficient order processing and customer service tools

### 🎨 Modern Dark Glassmorphic UI

- Beautiful dark theme with glassmorphic effects
- **Collapsible Sidebar Navigation** (Desktop) - Default collapsed for maximum screen space
  - Smooth expand/collapse transitions
  - Icon-only view when collapsed
  - Enhanced toggle button with glow effects
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Compact Layout** - Reduced spacing and padding for better content density
- Component-specific color theming:
  - Emerald/Green for investments & profits
  - Cyan/Blue for cyber services
  - Red/Rose for debts
  - Purple/Pink for general UI
- Backdrop blur and translucent panels
- Gradient accents and hover effects
- Hidden scrollbars for cleaner appearance

## 🚀 Tech Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS 3
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Build Tool:** Vite
- **Icons:** Lucide React
- **State Management:** React Context API
- **Date Formatting:** Custom utility functions for dd/mm/yyyy format
- **Automated Backups:** GitHub Actions (nightly database backups)

### Compliance & Store Readiness

- **Privacy Policy:** [public/privacy.html](./public/privacy.html) and [PRIVACY_POLICY.md](./PRIVACY_POLICY.md)
- **Android Assets:** Generated via @capacitor/assets (icons/splash)
- **Release Guides:** ANDROID_QUICK_START.md, ANDROID_RELEASE_GUIDE.md
- **Hosted Domain:** finance.lenzro.com (Vercel)

## 🔐 Automated Database Backups

This project includes **automated nightly backups** of your Supabase database using GitHub Actions.

### Features:

- ⏰ **Scheduled Backups** - Runs every night at 2:00 AM UTC
- 📦 **Triple Backup** - Schema, data, and full backups
- 💾 **30-Day Retention** - Stored as GitHub artifacts
- 🔄 **Manual Trigger** - Run backups anytime via GitHub Actions
- 📊 **Backup Reports** - Detailed logs for each backup
- ☁️ **Optional Cloud Storage** - Supports AWS S3, Google Cloud, Azure

### Quick Setup:

1. Add these secrets to your GitHub repository:
   - `SUPABASE_ACCESS_TOKEN`
   - `SUPABASE_PROJECT_ID`
   - `SUPABASE_DB_PASSWORD`
2. Backups run automatically every night
3. Download backups from GitHub Actions → Artifacts

📖 **Full Documentation:** See [`BACKUP_SETUP_GUIDE.md`](./BACKUP_SETUP_GUIDE.md) for detailed setup instructions, restore procedures, and best practices.

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/yussuf3468/TopGearLandingPage.git
cd TopGearLandingPage/bookStore
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:

- Run the SQL scripts in order:
  1. `SUPABASE_FULL_BOOTSTRAP.sql` - Main database schema
  2. `SUPABASE_FINANCIALS.sql` - Financial tables
  3. `SUPABASE_PATCH_*.sql` - Any patches as needed

5. Start the development server:

```bash
npm run dev
```

## 🏗️ Project Structure

```
bookStore/
├── src/
│   ├── components/           # React components
│   │   ├── Dashboard.tsx     # Main dashboard
│   │   ├── Inventory.tsx     # Product management
│   │   ├── Sales.tsx         # Sales tracking
│   │   ├── InitialInvestment.tsx  # Investment tracking
│   │   ├── DebtManagement.tsx     # Debt tracking
│   │   ├── ExpenseManagement.tsx  # Expense tracking
│   │   ├── CustomerStoreNew.tsx   # Customer interface
│   │   └── ...
│   ├── contexts/            # React contexts
│   ├── lib/                 # Utilities and configs
│   ├── types/               # TypeScript types
│   └── styles/              # Style utilities
├── public/                  # Static assets
└── SQL scripts/             # Database setup scripts
```

## 📱 Key Components

### Admin Dashboard

- **StatCards** - Real-time financial metrics
- **Reports** - Comprehensive financial reports
- **User Activity** - Track system usage

### Inventory Management

- Product CRUD operations
- Image upload and management
- Stock level alerts
- Category management
- Detailed product view modal

### Financial Management

- **Initial Investment** - Track startup capital and sources
- **Debt Management** - Monitor loans and repayment schedules
- **Expense Management** - Categorize and track business expenses
- Real-time financial analytics

### Customer Store

- Beautiful product showcase
- Advanced search with suggestions
- Shopping cart with glassmorphic design
- Checkout with delivery address selector
- Order tracking

## 🎨 Design System

### Colors

- **Background:** Dark gradient (`from-slate-900 via-purple-900 to-slate-900`)
- **Glass Panels:** `bg-white/10 backdrop-blur-xl border-white/20`
- **Text Hierarchy:**
  - Primary: `text-white`
  - Secondary: `text-slate-300`
  - Tertiary: `text-slate-400`
- **Accents:**
  - Investment/Profit: Emerald/Green
  - Cyber Services: Cyan/Blue
  - Debts: Red/Rose
  - General: Purple/Pink

### Components

- Glassmorphic cards with backdrop blur
- Gradient buttons and badges
- Smooth hover transitions
- Responsive layouts
- Collapsible sidebar navigation
- Compact spacing for optimal screen utilization

## 🚀 Deployment

### Prerequisites

- Node.js 18+ installed
- Supabase account with project created
- Database tables created and configured

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
3. Configure environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click "Deploy"

### Deploy to Netlify

1. Build the project:

```bash
npm run build
```

2. Deploy to Netlify:
   - Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
   - Or use Netlify CLI:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Manual Deployment

1. Build the production bundle:

```bash
npm run build
```

2. The `dist` folder contains all static files ready for deployment
3. Upload to any static hosting service (AWS S3, Azure, etc.)

### Environment Variables

Required for production:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔐 Security

- Row Level Security (RLS) policies on all tables
- Secure authentication with Supabase Auth
- Role-based access control (Admin/Staff)
- Protected admin routes
- Secure environment variables

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Performance

- Lazy loading for images
- Code splitting with Vite
- Optimized bundle size
- Fast refresh during development
- Production-ready build with minification

## 📈 Recent Updates (Latest Commit)

✅ **UI Enhancement: Compact Layout**

- Collapsible sidebar navigation (default collapsed)
- Reduced spacing and font sizes across all components
- Fixed mobile navbar overlap
- Enhanced toggle button visibility
- Improved text display in stat cards

## 📈 Future Enhancements

- [ ] Mobile apps (iOS/Android)
- [ ] Advanced analytics and AI insights
- [ ] Barcode scanning for inventory
- [ ] Email notifications
- [ ] Multi-language support (Somali/English)
- [ ] PDF report generation
- [ ] Integration with payment gateways
- [ ] Offline mode with PWA

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary to Hassan Muse BookShop.

## 👨‍💻 Developer

Created by Yussuf Hassan Muse

- GitHub: [@yussuf3468](https://github.com/yussuf3468)
- Email: yussufhassan3468@gmail.com

## 🙏 Acknowledgments

- Built with React and TypeScript
- Styled with Tailwind CSS
- Powered by Supabase
- Icons by Lucide

---

**Hassan Financial System** - Modern, Beautiful, and Powerful Financial Management 💼✨
