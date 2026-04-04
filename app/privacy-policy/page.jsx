import React from "react";

export default function PrivacyPolicy() {
  const lastUpdated = "October 24, 2023"; // Update this to today's date

  return (
    <div className="bg-white text-slate-800 min-h-screen py-20 px-6 lg:px-20 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-[1000] text-slate-900 tracking-tighter uppercase italic mb-4">
          Privacy <span className="text-indigo-600">Policy</span>
        </h1>
        <p className="text-slate-500 font-bold mb-12 uppercase tracking-widest text-sm">
          Last Updated: {lastUpdated}
        </p>

        <div className="space-y-10 leading-relaxed text-lg">
          <section>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">
              1. Introduction
            </h2>
            <p>
              Welcome to <strong>[Your Business Name]</strong>. We value your privacy and are committed to protecting your personal data. This policy outlines how we handle information when you use our website and services, particularly concerning the processing of payments through our partner, <strong>Razorpay</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">
              2. Information We Collect
            </h2>
            <p className="mb-4">We collect information that allows us to provide a seamless experience, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Identifiers:</strong> Name, email address, and contact details.</li>
              <li><strong>Transaction Data:</strong> Details about payments to and from you and other details of products/services you have purchased from us.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, and usage patterns.</li>
            </ul>
          </section>

          <section className="bg-indigo-50 p-8 rounded-[2rem] border-2 border-indigo-100">
            <h2 className="text-2xl font-black text-indigo-900 uppercase tracking-tight mb-4">
              3. Payment Processing (Razorpay)
            </h2>
            <p className="text-indigo-900/80">
              We use <strong>Razorpay</strong> for processing payments. We do not store your card data on our servers. The data is encrypted through the Payment Card Industry Data Security Standard (PCI-DSS) when processing payment. Your purchase transaction data is only used as long as is necessary to complete your purchase transaction.
            </p>
            <p className="mt-4 text-indigo-900/80">
              For more insight, you may also want to read the terms and conditions of 
              <a href="https://razorpay.com/terms/" target="_blank" className="underline ml-1 font-bold">Razorpay here</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">
              4. How We Use Your Data
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To process and deliver your orders.</li>
              <li>To manage payments, fees, and charges.</li>
              <li>To notify you about changes to our terms or privacy policy.</li>
              <li>To improve our website, services, and customer experiences.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">
              5. Data Disclosure
            </h2>
            <p>
              We may share your information with third parties (like Razorpay) solely to facilitate transactions, comply with legal obligations, or protect our rights. We do not sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">
              6. Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete your personal information. If you wish to exercise these rights, please contact us at the email provided below.
            </p>
          </section>

          <hr className="border-slate-200" />

          <section className="pb-20">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">
              7. Contact Us
            </h2>
            <p className="font-bold text-slate-600">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="mt-4 p-6 bg-slate-100 rounded-2xl inline-block">
              <p className="text-slate-900 font-black">Email: support@[yourdomain].com</p>
              <p className="text-slate-900 font-black">Address: [Your Physical Business Address, City, State, ZIP]</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}