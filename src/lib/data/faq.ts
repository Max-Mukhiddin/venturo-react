export interface FaqItem { question: string; answer: string; }
export const shoppingFaq: FaqItem[] = [
  { question: "What is Venturo?", answer: "Venturo is an outdoor marketplace for browsing products and gear across categories such as climbing, camping, hiking, trekking, cycling, apparel, and footwear." },
  { question: "How do I find a product?", answer: "Use the Shop page search, collection filters, and sorting controls to narrow the catalogue and open any product for more details." },
  { question: "How do I add a product to my basket?", answer: "Use the Add To Cart button on a product card or product detail page. The basket keeps the selected product and quantity while you continue browsing." },
  { question: "What happens if a product is out of stock?", answer: "Products with no available stock cannot be added to the basket until stock becomes available again." },
  { question: "Can I browse products by category?", answer: "Yes. Venturo supports outdoor collections including climbing, camping, hiking, trekking, cycling, apparel, footwear, and other gear." },
];
export const accountFaq: FaqItem[] = [
  { question: "Do I need an account to browse Venturo?", answer: "No. You can browse products without signing in. Some account and order actions may require authentication." },
  { question: "How can I view my account information?", answer: "Sign in and open the account area to access the account features currently available to you." },
  { question: "What should I do if my account is blocked?", answer: "A blocked account cannot use protected Venturo features. Use the Contact page to request assistance." },
  { question: "How can I contact Venturo?", answer: "Open the Contact page and submit the contact form. Venturo uses the existing contact submission flow to receive the message." },
  { question: "Where can I find more information about a product?", answer: "Open the product detail page to view the product information currently available for that listing." },
];

// Legacy Help tab compatibility; the dedicated FAQ page renders the groups.
export const faq = [...shoppingFaq, ...accountFaq];
