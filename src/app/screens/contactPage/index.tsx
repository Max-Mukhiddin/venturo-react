import React, { useState } from "react";
import "../../../css/contact.css";
import { ContactMessageInput } from "../../../lib/types/contact";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../../../lib/sweetAlert";
import Breadcrumb from "../../components/breadcrumb";
import ContactService from "../../services/ContactService";
import FreeShipping from "../homePage/FreeShipping";

const emptyContactInput: ContactMessageInput = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [contactInput, setContactInput] = useState<ContactMessageInput>(emptyContactInput);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange =
    (field: keyof ContactMessageInput) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setContactInput((previous) => ({ ...previous, [field]: event.target.value }));
    };

  const submitContactHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!agreedToTerms) {
      setFormError("Please confirm before sending your message.");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      await new ContactService().submitMessage(contactInput);
      setContactInput(emptyContactInput);
      setAgreedToTerms(false);
      await sweetTopSuccessAlert("Message sent!", 800);
    } catch (error) {
      console.log("Error, submitContactHandler:", error);
      setFormError("We could not send your message. Please try again.");
      sweetErrorHandling(error).then();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <Breadcrumb
        heading="Contact Us"
        trail={[{ label: "Home", to: "/" }, { label: "Contact Us" }]}
      />

      <main className="contact-main">
        <section className="contact-intro" aria-labelledby="contact-intro-heading">
          <div className="contact-form-column">
            <h2 id="contact-intro-heading">We&apos;re Always Here to Assist</h2>
            <p className="contact-lead">Send Venturo a message and our team can review your enquiry.</p>

            <form className="contact-form" onSubmit={submitContactHandler}>
              <div className="contact-field-row">
                <label className="contact-field" htmlFor="contact-name">
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={contactInput.name}
                    onChange={handleChange("name")}
                    required
                  />
                  <span>Your Name</span>
                </label>
                <label className="contact-field" htmlFor="contact-subject">
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={contactInput.subject}
                    onChange={handleChange("subject")}
                    required
                  />
                  <span>Subject</span>
                </label>
              </div>

              <label className="contact-field" htmlFor="contact-email">
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={contactInput.email}
                  onChange={handleChange("email")}
                  required
                />
                <span>Your Email Address</span>
              </label>

              <label className="contact-field" htmlFor="contact-message">
                <textarea
                  id="contact-message"
                  name="message"
                  value={contactInput.message}
                  onChange={handleChange("message")}
                  required
                />
                <span>Additional Message</span>
              </label>

              <label className="contact-terms" htmlFor="contact-terms">
                <input
                  id="contact-terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(event) => setAgreedToTerms(event.target.checked)}
                />
                <span>I confirm this message is ready to send to Venturo.</span>
              </label>

              <p className="contact-form-error" role="alert" aria-live="polite">
                {formError}
              </p>

              <button className="contact-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Submit Now"}
              </button>
            </form>
          </div>

          <aside className="contact-details" aria-label="Contact information">
            <div className="contact-detail-block">
              <h2>Contact Details</h2>
              <p>Messages are received through this contact form.</p>
            </div>
            <div className="contact-detail-block">
              <h2>Social Media</h2>
              <div className="contact-social-icons" aria-label="Venturo social channels">
                <img src="/icons/instagram.svg" alt="" />
                <img src="/icons/facebook.svg" alt="" />
                <img src="/icons/twitter.svg" alt="" />
                <img src="/icons/youtube.svg" alt="" />
              </div>
            </div>
            <div className="contact-detail-block">
              <h2>Response Timing</h2>
              <p>Support hours are not currently published.</p>
            </div>
          </aside>

          <aside className="contact-brand-panel" aria-label="Decorative outdoor trail image">
            <img src="/img/contact-trail.jpg" alt="" />
          </aside>
        </section>

        <section className="contact-location" aria-label="Store location">
          <div>
            <h2>Location</h2>
            <p>Venturo does not currently publish a store location.</p>
          </div>
        </section>
      </main>

      <div className="homepage contact-benefits">
        <FreeShipping />
      </div>
    </div>
  );
}
