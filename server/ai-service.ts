import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class AIService {
  private systemPrompt = `You are Face2Finance AI, a friendly and knowledgeable financial education assistant. Your role is to help users learn about personal finance, budgeting, investing, and financial planning in simple, everyday language.

Key guidelines:
- Always provide practical, actionable advice
- Explain financial concepts in simple terms
- Be supportive and encouraging about financial goals
- Focus on financial education and literacy
- Ask clarifying questions when needed
- Provide specific examples when explaining concepts
- Never give specific investment advice or recommendations
- Always remind users to consult financial professionals for major decisions
- Keep responses concise and easy to understand
- Use encouraging tone to motivate good financial habits

Areas you can help with:
- Budgeting and expense tracking
- Saving strategies and emergency funds
- Basic investing concepts
- Debt management
- Financial goal setting
- Understanding financial products (loans, credit cards, etc.)
- Tax basics
- Financial planning fundamentals
- Fraud prevention and financial security`;

  async generateResponse(messages: ChatMessage[], userContext?: any): Promise<string> {
    try {
      const contextPrompt = userContext ? `
User Context:
- Daily Goal: ${userContext.dailyGoal} minutes of learning
- Knowledge Level: ${userContext.knowledgeLevel || 'beginner'}
- Age Group: ${userContext.ageGroup || 'not specified'}
- Current Financial Goals: ${userContext.activeGoals || 0} goals being tracked
- Recent Activity: ${userContext.recentLessons || 0} lessons completed
` : '';

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: this.systemPrompt + contextPrompt },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      return completion.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('OpenAI API error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('AI service is not properly configured. Please check API key settings.');
        }
        if (error.message.includes('quota')) {
          throw new Error('AI service quota exceeded. Please try again later.');
        }
      }
      
      throw new Error('AI service is temporarily unavailable. Please try again later.');
    }
  }

  async generateFinancialAdvice(userFinancialData: any): Promise<string> {
    try {
      const { income, expenses, savings, goals, debts } = userFinancialData;
      
      const analysisPrompt = `Based on this user's financial situation, provide personalized advice:
      
Monthly Income: ₹${income || 'Not provided'}
Monthly Expenses: ₹${expenses || 'Not provided'}
Current Savings: ₹${savings || 'Not provided'}
Financial Goals: ${goals?.length || 0} active goals
Outstanding Debts: ₹${debts || 'Not provided'}

Provide 3-4 specific, actionable recommendations to improve their financial health. Keep it encouraging and practical.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: analysisPrompt }
        ],
        max_tokens: 400,
        temperature: 0.6
      });

      return completion.choices[0].message.content || "Unable to generate financial advice at this time.";
    } catch (error) {
      console.error('Error generating financial advice:', error);
      throw new Error('Unable to generate financial advice. Please try again later.');
    }
  }

  async generateBudgetSuggestions(transactions: any[]): Promise<string> {
    try {
      if (!transactions || transactions.length === 0) {
        return "To provide personalized budget suggestions, I'll need to see some of your transaction history. Start by adding a few transactions to track your spending patterns.";
      }

      const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {});

      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const analysisPrompt = `Based on this spending analysis, provide budget optimization suggestions:

Total Monthly Income: ₹${totalIncome}
Total Monthly Expenses: ₹${totalExpenses}
Savings Rate: ${totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0}%

Expense Breakdown:
${Object.entries(expensesByCategory).map(([category, amount]) => 
  `${category}: ₹${amount} (${totalExpenses > 0 ? ((amount as number) / totalExpenses * 100).toFixed(1) : 0}%)`
).join('\n')}

Provide specific recommendations for budget optimization and expense reduction.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: analysisPrompt }
        ],
        max_tokens: 400,
        temperature: 0.6
      });

      return completion.choices[0].message.content || "Unable to generate budget suggestions at this time.";
    } catch (error) {
      console.error('Error generating budget suggestions:', error);
      throw new Error('Unable to generate budget suggestions. Please try again later.');
    }
  }

  async generateQuizQuestion(topic: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): Promise<any> {
    try {
      const questionPrompt = `Generate a ${difficulty} financial education quiz question about "${topic}". 

Format the response as JSON with this structure:
{
  "question": "The question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Brief explanation of the correct answer"
}

Make it educational and relevant to Indian financial context when appropriate.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a financial education expert creating quiz questions." },
          { role: "user", content: questionPrompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 300,
        temperature: 0.8
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response || '{}');
    } catch (error) {
      console.error('Error generating quiz question:', error);
      throw new Error('Unable to generate quiz question. Please try again later.');
    }
  }

  async analyzeSentiment(text: string): Promise<{ rating: number, confidence: number }> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a sentiment analysis expert. Analyze the sentiment of the text and provide a rating from 1 to 5 stars and a confidence score between 0 and 1. Respond with JSON in this format: { 'rating': number, 'confidence': number }",
          },
          {
            role: "user",
            content: text,
          },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{"rating": 3, "confidence": 0.5}');

      return {
        rating: Math.max(1, Math.min(5, Math.round(result.rating))),
        confidence: Math.max(0, Math.min(1, result.confidence)),
      };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return { rating: 3, confidence: 0.5 }; // neutral fallback
    }
  }
}

export const aiService = new AIService();