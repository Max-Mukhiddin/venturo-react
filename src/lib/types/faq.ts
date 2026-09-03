export type FAQGroup = "SHOPPING" | "ACCOUNT_SUPPORT";
export interface FAQ { _id: string; faqQuestion: string; faqAnswer: string; faqGroup: FAQGroup; faqOrder: number; }
