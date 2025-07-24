# Component Organization

This directory contains all React components organized into logical groups for better maintainability and clarity.

## 📁 Folder Structure

### `/cards/` - Dashboard Cards
Components that display data and information on the main dashboard:
- `AIInsightCard.jsx` - AI-powered financial insights
- `BalanceCard.jsx` - Total balance and performance display
- `BudgetPlanCard.jsx` - Budget categories and spending tracking
- `PaycheckCard.jsx` - Paycheck tracking and income summary
- `SavingsJarCard.jsx` - Savings goals and jar management
- `SavingsGoals.jsx` - Savings goals display
- `TransactionHistory.jsx` - Recent transactions list

### `/modals/` - Modal Components
Modal content components for different forms and dialogs:
- `BudgetModalContent.jsx` - Add budget category modal
- `ExpenseModalContent.jsx` - Log expense modal
- `PaycheckModalContent.jsx` - Add paycheck modal
- `SavingsModalContent.jsx` - Create savings jar modal

### `/ui/` - User Interface Components
Reusable UI components and layout elements:
- `Calculator.jsx` - Built-in calculator component
- `Footer.jsx` - Application footer
- `LoginPage.jsx` - User authentication page
- `QuickActions.jsx` - Quick action buttons
- `ReminderBanner.jsx` - Notification banner
- `ShapeBlur.jsx` - Animated background component

### `/forms/` - Form Components
Form-related components:
- `TransactionForm.jsx` - Transaction input form

## 🚀 Usage

### Importing Components

**Individual imports:**
```javascript
import BalanceCard from './components/cards/BalanceCard'
import Calculator from './components/ui/Calculator'
```

**Group imports (recommended):**
```javascript
import { BalanceCard, PaycheckCard } from './components/cards'
import { Calculator, Footer } from './components/ui'
import { ExpenseModalContent } from './components/modals'
```

## 🎯 Benefits

- **Better Organization**: Related components are grouped together
- **Easier Navigation**: Clear folder structure makes finding components simple
- **Scalable**: Easy to add new components to appropriate folders
- **Clean Imports**: Index files provide clean import syntax
- **Maintainable**: Logical separation makes code easier to maintain

## 📝 Adding New Components

1. **Cards**: Add dashboard display components to `/cards/`
2. **Modals**: Add modal content components to `/modals/`
3. **UI**: Add reusable UI components to `/ui/`
4. **Forms**: Add form components to `/forms/`
5. **Update index.js**: Add exports to the appropriate index file 