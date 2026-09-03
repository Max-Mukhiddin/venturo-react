import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../../css/faq.css";
import { accountFaq, FaqItem, shoppingFaq } from "../../../lib/data/faq";
import Breadcrumb from "../../components/breadcrumb";
import FreeShipping from "../homePage/FreeShipping";

function FaqGroup({ title, items }: { title: string; items: FaqItem[] }) {
  const [open, setOpen] = useState(0);
  return <section className="faq-group"><h2>{title}</h2><p>Helpful information about the Venturo experience.</p><div className="faq-list">{items.map((item, index) => {
    const isOpen = index === open; const id = `${title}-${index}`;
    return <article className="faq-item" key={item.question}><button type="button" aria-expanded={isOpen} aria-controls={id} onClick={() => setOpen(isOpen ? -1 : index)}><span>{item.question}</span><b aria-hidden="true">{isOpen ? "−" : "+"}</b></button><div id={id} hidden={!isOpen}><p>{item.answer}</p></div></article>;
  })}</div></section>;
}

export default function FaqPage() { return <div className="faq-page"><Breadcrumb heading="FAQ" trail={[{ label: "Home", to: "/" }, { label: "FAQ" }]} /><main className="faq-main"><div className="faq-layout"><div><FaqGroup title="Shopping Information" items={shoppingFaq} /><FaqGroup title="Account & Order Support" items={accountFaq} /></div><aside className="faq-help"><h2>Have a question</h2><p>For help with an account or order, send Venturo a message through the contact form.</p><Link to="/contact">Contact Us</Link></aside></div></main><div className="homepage faq-benefits"><FreeShipping /></div></div>; }
