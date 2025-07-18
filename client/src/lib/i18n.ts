export type Language = 'en' | 'hi' | 'pa';

export interface Translation {
  // Navigation
  dashboard: string;
  lessons: string;
  quiz: string;
  tasks: string;
  profile: string;
  calculators: string;
  games: string;
  notifications: string;
  settings: string;
  
  // Dashboard
  welcome: string;
  searchPlaceholder: string;
  topCategories: string;
  featuredLessons: string;
  progress: string;
  monthlyPreview: string;
  
  // Categories
  budgeting: string;
  savings: string;
  fraud: string;
  privacy: string;
  tips: string;
  goals: string;
  aiAssistant: string;
  
  // Auth
  login: string;
  register: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
  forgotPassword: string;
  
  // Onboarding
  selectLanguage: string;
  knowledgeLevel: string;
  knowledgeAssessment: string;
  beginner: string;
  intermediate: string;
  advanced: string;
  dailyGoal: string;
  ageGroup: string;
  ageSelection: string;
  
  // Calculators
  budgetCalculator: string;
  taxCalculator: string;
  emiCalculator: string;
  investmentCalculator: string;
  monthlyIncome: string;
  monthlyExpenses: string;
  
  // Tasks
  addTask: string;
  taskTitle: string;
  taskDescription: string;
  dueDate: string;
  priority: string;
  high: string;
  medium: string;
  low: string;
  
  // Transactions
  addTransaction: string;
  transactionName: string;
  amount: string;
  income: string;
  expense: string;
  category: string;
  description: string;
  
  // AI Chat
  aiFinancialAssistant: string;
  askQuestion: string;
  budgetHelp: string;
  saveMoney: string;
  investmentBasics: string;
  financialGoals: string;
  
  // Common
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  view: string;
  add: string;
  submit: string;
  next: string;
  back: string;
  complete: string;
  loading: string;
  error: string;
  success: string;
}

const translations: Record<Language, Translation> = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    lessons: 'Lessons',
    quiz: 'Quiz',
    tasks: 'Tasks',
    profile: 'Profile',
    calculators: 'Calculators',
    games: 'Games',
    notifications: 'Notifications',
    settings: 'Settings',
    
    // Dashboard
    welcome: 'Welcome to Face2Finance',
    searchPlaceholder: 'Search tutorials, fraud types, or finance tips...',
    topCategories: 'Top Categories',
    featuredLessons: 'Featured Lessons',
    progress: 'Progress',
    monthlyPreview: 'Monthly Preview',
    
    // Categories
    budgeting: 'Budgeting',
    savings: 'Saving & Investment',
    fraud: 'Cyber Fraud Types',
    privacy: 'Data Privacy & Protection',
    tips: 'Tips',
    goals: 'Goals',
    aiAssistant: 'AI Assistant',
    
    // Auth
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    
    // Onboarding
    selectLanguage: 'Select Language',
    knowledgeLevel: 'Knowledge Level',
    knowledgeAssessment: 'Knowledge Assessment',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    dailyGoal: 'Daily Goal',
    ageGroup: 'Age Group',
    ageSelection: 'Age Selection',
    
    // Calculators
    budgetCalculator: 'Budget Calculator',
    taxCalculator: 'Tax Calculator',
    emiCalculator: 'EMI Calculator',
    investmentCalculator: 'Investment Calculator',
    monthlyIncome: 'Monthly Income',
    monthlyExpenses: 'Monthly Expenses',
    
    // Tasks
    addTask: 'Add Task',
    taskTitle: 'Task Title',
    taskDescription: 'Task Description',
    dueDate: 'Due Date',
    priority: 'Priority',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    
    // Transactions
    addTransaction: 'Add Transaction',
    transactionName: 'Transaction Name',
    amount: 'Amount',
    income: 'Income',
    expense: 'Expense',
    category: 'Category',
    description: 'Description',
    
    // AI Chat
    aiFinancialAssistant: 'AI Financial Assistant',
    askQuestion: 'Ask me about budgeting, investing, or any financial topic...',
    budgetHelp: 'Budget Help',
    saveMoney: 'Save Money',
    investmentBasics: 'Investment Basics',
    financialGoals: 'Financial Goals',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    add: 'Add',
    submit: 'Submit',
    next: 'Next',
    back: 'Back',
    complete: 'Complete',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
  },
  
  hi: {
    // Navigation
    dashboard: 'डैशबोर्ड',
    lessons: 'पाठ',
    quiz: 'प्रश्नोत्तरी',
    tasks: 'कार्य',
    profile: 'प्रोफ़ाइल',
    calculators: 'कैलकुलेटर',
    games: 'गेम्स',
    notifications: 'सूचनाएं',
    settings: 'सेटिंग्स',
    
    // Dashboard
    welcome: 'Face2Finance में आपका स्वागत है',
    searchPlaceholder: 'ट्यूटोरियल, धोखाधड़ी के प्रकार, या वित्त सुझाव खोजें...',
    topCategories: 'मुख्य श्रेणियां',
    featuredLessons: 'विशेष पाठ',
    progress: 'प्रगति',
    monthlyPreview: 'मासिक पूर्वावलोकन',
    
    // Categories
    budgeting: 'बजट बनाना',
    savings: 'बचत और निवेश',
    fraud: 'साइबर धोखाधड़ी के प्रकार',
    privacy: 'डेटा गोपनीयता और सुरक्षा',
    tips: 'सुझाव',
    goals: 'लक्ष्य',
    aiAssistant: 'AI सहायक',
    
    // Auth
    login: 'लॉगिन',
    register: 'रजिस्टर',
    email: 'ईमेल',
    password: 'पासवर्ड',
    firstName: 'पहला नाम',
    lastName: 'अंतिम नाम',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    forgotPassword: 'पासवर्ड भूल गए?',
    
    // Onboarding
    selectLanguage: 'भाषा चुनें',
    knowledgeLevel: 'ज्ञान स्तर',
    knowledgeAssessment: 'ज्ञान मूल्यांकन',
    beginner: 'शुरुआती',
    intermediate: 'मध्यम',
    advanced: 'उन्नत',
    dailyGoal: 'दैनिक लक्ष्य',
    ageGroup: 'आयु समूह',
    ageSelection: 'आयु चयन',
    
    // Calculators
    budgetCalculator: 'बजट कैलकुलेटर',
    taxCalculator: 'टैक्स कैलकुलेटर',
    emiCalculator: 'EMI कैलकुलेटर',
    investmentCalculator: 'निवेश कैलकुलेटर',
    monthlyIncome: 'मासिक आय',
    monthlyExpenses: 'मासिक खर्च',
    
    // Tasks
    addTask: 'कार्य जोड़ें',
    taskTitle: 'कार्य शीर्षक',
    taskDescription: 'कार्य विवरण',
    dueDate: 'नियत तारीख',
    priority: 'प्राथमिकता',
    high: 'उच्च',
    medium: 'मध्यम',
    low: 'कम',
    
    // Transactions
    addTransaction: 'लेन-देन जोड़ें',
    transactionName: 'लेन-देन का नाम',
    amount: 'राशि',
    income: 'आय',
    expense: 'खर्च',
    category: 'श्रेणी',
    description: 'विवरण',
    
    // AI Chat
    aiFinancialAssistant: 'AI वित्तीय सहायक',
    askQuestion: 'बजट, निवेश, या किसी भी वित्तीय विषय के बारे में पूछें...',
    budgetHelp: 'बजट सहायता',
    saveMoney: 'पैसे बचाएं',
    investmentBasics: 'निवेश की मूल बातें',
    financialGoals: 'वित्तीय लक्ष्य',
    
    // Common
    save: 'सहेजें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    view: 'देखें',
    add: 'जोड़ें',
    submit: 'जमा करें',
    next: 'अगला',
    back: 'वापस',
    complete: 'पूर्ण',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
  },
  
  pa: {
    // Navigation
    dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    lessons: 'ਪਾਠ',
    quiz: 'ਸਵਾਲ-ਜਵਾਬ',
    tasks: 'ਕੰਮ',
    profile: 'ਪ੍ਰੋਫਾਈਲ',
    calculators: 'ਕੈਲਕੁਲੇਟਰ',
    games: 'ਗੇਮਸ',
    notifications: 'ਸੂਚਨਾਵਾਂ',
    settings: 'ਸੈਟਿੰਗਸ',
    
    // Dashboard
    welcome: 'Face2Finance ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ',
    searchPlaceholder: 'ਟਿਊਟੋਰਿਅਲ, ਧੋਖਾਧੜੀ ਦੀਆਂ ਕਿਸਮਾਂ, ਜਾਂ ਵਿੱਤੀ ਸੁਝਾਅ ਖੋਜੋ...',
    topCategories: 'ਮੁੱਖ ਸ਼੍ਰੇਣੀਆਂ',
    featuredLessons: 'ਵਿਸ਼ੇਸ਼ ਪਾਠ',
    progress: 'ਤਰੱਕੀ',
    monthlyPreview: 'ਮਾਸਿਕ ਪੂਰਵ-ਝਲਕ',
    
    // Categories
    budgeting: 'ਬਜਟ ਬਣਾਉਣਾ',
    savings: 'ਬਚਤ ਅਤੇ ਨਿਵੇਸ਼',
    fraud: 'ਸਾਈਬਰ ਧੋਖਾਧੜੀ ਦੀਆਂ ਕਿਸਮਾਂ',
    privacy: 'ਡੇਟਾ ਪ੍ਰਾਈਵੇਸੀ ਅਤੇ ਸੁਰੱਖਿਆ',
    tips: 'ਸੁਝਾਅ',
    goals: 'ਟੀਚੇ',
    aiAssistant: 'AI ਸਹਾਇਕ',
    
    // Auth
    login: 'ਲਾਗਇਨ',
    register: 'ਰਜਿਸਟਰ',
    email: 'ਈਮੇਲ',
    password: 'ਪਾਸਵਰਡ',
    firstName: 'ਪਹਿਲਾ ਨਾਮ',
    lastName: 'ਅੰਤਿਮ ਨਾਮ',
    confirmPassword: 'ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ',
    forgotPassword: 'ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?',
    
    // Onboarding
    selectLanguage: 'ਭਾਸ਼ਾ ਚੁਣੋ',
    knowledgeLevel: 'ਗਿਆਨ ਪੱਧਰ',
    knowledgeAssessment: 'ਗਿਆਨ ਮੁਲਾਂਕਣ',
    beginner: 'ਸ਼ੁਰੂਆਤੀ',
    intermediate: 'ਮੱਧਮ',
    advanced: 'ਉੱਨਤ',
    dailyGoal: 'ਰੋਜ਼ਾਨਾ ਟੀਚਾ',
    ageGroup: 'ਉਮਰ ਸਮੂਹ',
    ageSelection: 'ਉਮਰ ਚੋਣ',
    
    // Calculators
    budgetCalculator: 'ਬਜਟ ਕੈਲਕੁਲੇਟਰ',
    taxCalculator: 'ਟੈਕਸ ਕੈਲਕੁਲੇਟਰ',
    emiCalculator: 'EMI ਕੈਲਕੁਲੇਟਰ',
    investmentCalculator: 'ਨਿਵੇਸ਼ ਕੈਲਕੁਲੇਟਰ',
    monthlyIncome: 'ਮਾਸਿਕ ਆਮਦਨ',
    monthlyExpenses: 'ਮਾਸਿਕ ਖਰਚ',
    
    // Tasks
    addTask: 'ਕੰਮ ਜੋੜੋ',
    taskTitle: 'ਕੰਮ ਦਾ ਸਿਰਲੇਖ',
    taskDescription: 'ਕੰਮ ਦਾ ਵੇਰਵਾ',
    dueDate: 'ਨਿਰਧਾਰਤ ਤਾਰੀਖ',
    priority: 'ਤਰਜੀਹ',
    high: 'ਉੱਚ',
    medium: 'ਮੱਧਮ',
    low: 'ਘੱਟ',
    
    // Transactions
    addTransaction: 'ਲੈਣ-ਦੇਣ ਜੋੜੋ',
    transactionName: 'ਲੈਣ-ਦੇਣ ਦਾ ਨਾਮ',
    amount: 'ਰਕਮ',
    income: 'ਆਮਦਨ',
    expense: 'ਖਰਚ',
    category: 'ਸ਼੍ਰੇਣੀ',
    description: 'ਵੇਰਵਾ',
    
    // AI Chat
    aiFinancialAssistant: 'AI ਵਿੱਤੀ ਸਹਾਇਕ',
    askQuestion: 'ਬਜਟ, ਨਿਵੇਸ਼, ਜਾਂ ਕਿਸੇ ਵੀ ਵਿੱਤੀ ਵਿਸ਼ੇ ਬਾਰੇ ਪੁੱਛੋ...',
    budgetHelp: 'ਬਜਟ ਸਹਾਇਤਾ',
    saveMoney: 'ਪੈਸੇ ਬਚਾਓ',
    investmentBasics: 'ਨਿਵੇਸ਼ ਦੀਆਂ ਮੂਲ ਗੱਲਾਂ',
    financialGoals: 'ਵਿੱਤੀ ਟੀਚੇ',
    
    // Common
    save: 'ਸੇਵ ਕਰੋ',
    cancel: 'ਰੱਦ ਕਰੋ',
    delete: 'ਮਿਟਾਓ',
    edit: 'ਸੰਪਾਦਿਤ ਕਰੋ',
    view: 'ਵੇਖੋ',
    add: 'ਜੋੜੋ',
    submit: 'ਜਮ੍ਹਾਂ ਕਰੋ',
    next: 'ਅਗਲਾ',
    back: 'ਵਾਪਸ',
    complete: 'ਪੂਰਾ',
    loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    error: 'ਗਲਤੀ',
    success: 'ਸਫਲਤਾ',
  },
};

export const getTranslations = (language: Language): Translation => {
  return translations[language] || translations.en;
};

export const getLanguageName = (language: Language): string => {
  const names: Record<Language, string> = {
    en: 'English',
    hi: 'हिंदी',
    pa: 'ਪੰਜਾਬੀ'
  };
  return names[language];
};

export const availableLanguages: Language[] = ['en', 'hi', 'pa'];