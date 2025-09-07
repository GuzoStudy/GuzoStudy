// src/pages/Terms.jsx
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Terms = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />

      <main className="max-w-4xl mx-auto p-6 flex-1">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Terms & Conditions</h1>

        <section className="space-y-4 text-gray-700 text-sm leading-relaxed">
          <p>
            Welcome to GuzoStudy! By accessing or using our platform, you agree to comply with
            and be bound by these Terms and Conditions. Please read them carefully.
          </p>

          <p>
            <strong>1. Use of Service:</strong> You agree to use our platform for lawful purposes
            only. You shall not engage in any activity that could harm, disrupt, or interfere
            with the platform or its users.
          </p>

          <p>
            <strong>2. Account Responsibility:</strong> You are responsible for maintaining the
            confidentiality of your account credentials and for all activities that occur under
            your account.
          </p>

          <p>
            <strong>3. Content:</strong> All course content provided on GuzoStudy is the property
            of its respective creators. You may not copy, distribute, or reproduce content
            without permission.
          </p>

          <p>
            <strong>4. Payments:</strong> Any paid courses or services must be purchased through
            our official payment channels. Refunds and cancellations are subject to our payment
            policies.
          </p>

          <p>
            <strong>5. Modifications:</strong> GuzoStudy reserves the right to update or modify
            these Terms at any time. Continued use of the platform constitutes acceptance of
            the updated Terms.
          </p>

          <p>
            <strong>6. Limitation of Liability:</strong> GuzoStudy is not responsible for any
            damages, losses, or issues arising from the use of the platform or courses.
          </p>

          <p>
            If you have any questions about these Terms, please contact us via our Contact page.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
