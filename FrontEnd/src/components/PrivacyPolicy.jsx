
function PrivacyPolicy() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-gray-600 mb-4">
            At <span className="font-semibold">GuzoStudy</span>, your privacy
            is very important to us. This Privacy Policy explains how we
            collect, use, and protect your personal information when you use our
            services.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
            1. Information We Collect
          </h2>
          <ul className="list-disc ml-6 text-gray-600 space-y-1">
            <li>Personal details like your name, email address, and password.</li>
            <li>
              Information related to your role as a student or teacher,
              including course activity.
            </li>
            <li>Usage data such as IP address, browser type, and device info.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc ml-6 text-gray-600 space-y-1">
            <li>To create and manage your account.</li>
            <li>To personalize your learning experience.</li>
            <li>
              To improve our platform’s performance, security, and usability.
            </li>
            <li>To communicate updates, announcements, or support.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
            3. Sharing of Information
          </h2>
          <p className="text-gray-600 mb-4">
            We do not sell or rent your personal information. We may share
            information only with trusted partners who help us operate our
            platform, comply with legal obligations, or protect our users.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
            4. Data Security
          </h2>
          <p className="text-gray-600 mb-4">
            We use industry-standard security practices to protect your data.
            However, no method of transmission over the internet is 100% secure.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
            5. Your Rights
          </h2>
          <ul className="list-disc ml-6 text-gray-600 space-y-1">
            <li>Access, update, or delete your personal data.</li>
            <li>Request a copy of the data we hold about you.</li>
            <li>Opt-out of promotional communications.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
            6. Updates to This Policy
          </h2>
          <p className="text-gray-600 mb-4">
            We may update this Privacy Policy from time to time. Any changes
            will be posted here with an updated “last updated” date.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
            7. Contact Us
          </h2>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy, please contact
            us at:{" "}
            <a
              href="mailto:support@guzostudy.com"
              className="text-blue-600 hover:underline"
            >
              support@guzostudy.com
            </a>
          </p>

          <p className="text-gray-500 text-sm mt-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </>
  );
}

export default PrivacyPolicy;
