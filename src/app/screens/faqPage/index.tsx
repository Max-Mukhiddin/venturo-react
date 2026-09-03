import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../css/faq.css";
import { FAQ } from "../../../lib/types/faq";
import Breadcrumb from "../../components/breadcrumb";
import FreeShipping from "../homePage/FreeShipping";
import FaqService from "../../services/FaqService";

function FaqGroup({ title, items }: { title: string; items: FAQ[] }) {
  const [open, setOpen] = useState(0);
  return <section className="faq-group"><h2>{title}</h2><p>Helpful information about the Venturo experience.</p><div className="faq-list">{items.map((item, index) => {
    const isOpen = index === open; const id = `${title}-${index}`;
    return <article className="faq-item" key={item._id}><button type="button" aria-expanded={isOpen} aria-controls={id} onClick={() => setOpen(isOpen ? -1 : index)}><span>{item.faqQuestion}</span><b aria-hidden="true">{isOpen ? "−" : "+"}</b></button><div id={id} hidden={!isOpen}><p>{item.faqAnswer}</p></div></article>;
  })}</div></section>;
}

export default function FaqPage() { const [faqs,setFaqs]=useState<FAQ[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState(false);const load=()=>{setLoading(true);setError(false);new FaqService().getFaqs().then(setFaqs).catch(()=>setError(true)).finally(()=>setLoading(false));};useEffect(load,[]);const shopping=faqs.filter(x=>x.faqGroup==="SHOPPING");const account=faqs.filter(x=>x.faqGroup==="ACCOUNT_SUPPORT");const content=loading?<p className="faq-state">Loading FAQs...</p>:error?<p className="faq-state">FAQs could not be loaded. <button onClick={load}>Retry</button></p>:faqs.length===0?<p className="faq-state">No FAQs are currently available.</p>:<><FaqGroup title="Shopping Information" items={shopping}/><FaqGroup title="Account & Order Support" items={account}/></>;return <div className="faq-page"><Breadcrumb heading="FAQ" trail={[{ label: "Home", to: "/" }, { label: "FAQ" }]} /><main className="faq-main"><div className="faq-layout"><div>{content}</div><aside className="faq-help"><h2>Have a question</h2><p>For help with an account or order, send Venturo a message through the contact form.</p><Link to="/contact">Contact Us</Link></aside></div></main><div className="homepage faq-benefits"><FreeShipping /></div></div>; }
