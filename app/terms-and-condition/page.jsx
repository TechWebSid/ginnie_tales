import React from "react";

export default function TermsAndConditions() {
  const lastUpdated = "April 4, 2026"; // Ensure this is current

  return (
    <div className="bg-white text-slate-800 min-h-screen py-20 px-6 lg:px-20 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-[1000] text-slate-900 tracking-tighter uppercase italic mb-4">
          Terms & <span className="text-purple-600">Conditions</span>
        </h1>
        <p className="text-slate-500 font-bold mb-12 uppercase tracking-widest text-sm">
          Effective Date: {lastUpdated}
        </p>

        <div className="space-y-10 leading-relaxed text-lg">
          <section>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using <strong>[Your Business Name]</strong> ("the Website"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">
              2. Use of Services
            </h2>
            <p>
              Our platform allows users to explore magical themes and [Insert Core Service, e.g., "create personalized AI stories"]. You agree to use the services only for lawful purposes and in a way that does not infringe the rights of others.
            </p>
          </section>

          <section className="bg-purple-50 p-8 rounded-[2.5rem] border-2 border-purple-100">
            <h2 className="text-2xl font-black text-purple-900 uppercase tracking-tight mb-4">
              3. Payments & Billing
            </h2>
            <p className="mb-4 text-purple-900/80">
              We offer [Paid Services/Subscriptions]. All payments are processed securely via <strong>Razorpay</strong>. By providing your payment information, you represent that you are authorized to use the payment method.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-purple-900/80">
              <li><strong>Pricing:</strong> All prices are subject to change without prior notice.</li>
              <li><strong>Taxes:</strong> Users are responsible for any applicable taxes based on their location.</li>
              <li><strong>Confirmation:</strong> A transaction is considered complete only after a successful payment confirmation from Razorpay.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">
              4. User Accounts
            </h2>
            <p>
              To access certain features, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">
              5. Intellectual Property
            </h2>
            <p>
              All content on this website, including text, graphics, logos, and software, is the property of <strong>[Your Business Name]</strong> and is protected by copyright and intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">
              6. Limitation of Liability
            </h2>
            <p>
              <strong>[Your Business Name]</strong> shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">
              7. Termination
            </h2>
            <p>
              We reserve the right to terminate or suspend your access to our services immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users or our business interests.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">
              8. Governing Law
            </h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of <strong>[Your State/Country, e.g., India]</strong>, without regard to its conflict of law provisions.
            </p>
          </section>

          <hr className="border-slate-200" />

          <section className="pb-20">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">
              9. Contact Information
            </h2>
            <p className="text-slate-600 mb-6">
              For any questions regarding these Terms, please reach out to us:
            </p>
            <div className="p-8 bg-slate-900 text-white rounded-[2rem] inline-block shadow-xl">
              <p className="font-bold tracking-tight">Email: support@[yourdomain].com</p>
              <p className="font-bold tracking-tight mt-1">Phone: [Your Business Phone Number]</p>
              <p className="font-bold tracking-tight mt-1 underline">Address: [Your Full Physical Business Address]</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}