import React from "react";

export function CertificateDetail({ certificate }) {
  if (!certificate) {
    return (
      <div className="p-8 text-center bg-white/60 border-2 border-dashed border-blue-200 rounded-2xl shadow-inner backdrop-blur-sm">
        <p className="text-gray-600 italic">Select a certificate to view details.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-6 bg-gradient-to-br from-[#fdfcfb] via-[#fefefe] to-[#f7f9ff] overflow-hidden font-serif text-gray-900">
      {/* 🌤 Soft gradient ornaments */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle golden light glows */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-yellow-200/30 to-transparent rounded-br-full blur-[90px]" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tl from-blue-300/25 to-transparent rounded-tl-full blur-[90px]" />

        {/* Elegant golden swirl patterns */}
        <svg className="absolute top-14 left-14 w-56 h-56 opacity-10" viewBox="0 0 200 200" fill="none">
          <path
            d="M100 0C70 30 60 70 80 100C100 130 150 150 200 100C150 180 80 200 30 150C-20 100 30 30 100 0Z"
            fill="url(#goldGradient1)"
          />
          <defs>
            <linearGradient id="goldGradient1" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fcd34d" />
              <stop offset="1" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
        </svg>
        <svg className="absolute bottom-14 right-14 w-56 h-56 rotate-180 opacity-10" viewBox="0 0 200 200" fill="none">
          <path
            d="M100 0C70 30 60 70 80 100C100 130 150 150 200 100C150 180 80 200 30 150C-20 100 30 30 100 0Z"
            fill="url(#goldGradient2)"
          />
          <defs>
            <linearGradient id="goldGradient2" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fcd34d" />
              <stop offset="1" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 🪶 Certificate Container */}
      <div className="relative bg-gradient-to-br from-[#fffdf5] via-[#ffffff] to-[#eef3ff] border-[10px] border-double border-yellow-500 rounded-3xl shadow-[0_0_50px_-10px_rgba(0,0,0,0.2)] p-12 sm:p-16 max-w-3xl w-full text-center backdrop-blur-md">
        {/* Top ribbon */}
        <div className="absolute -top-6 left-0 right-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 py-2 rounded-t-3xl shadow-lg">
          <span className="text-white font-bold tracking-widest text-base sm:text-lg drop-shadow-lg">
            🏅 OFFICIAL CERTIFICATE 🏅
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-900 tracking-widest mt-8 drop-shadow-sm">
          Certificate of Excellence
        </h1>
        <p className="text-gray-700 italic mt-1 text-base">This certifies that</p>

        {/* Recipient */}
        <div className="my-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 underline decoration-yellow-400 decoration-4 underline-offset-[10px] mb-3">
            {certificate.user_name || "Student Name"}
          </h2>
          <p className="text-gray-700 text-lg">has successfully completed</p>
          <h3 className="text-2xl sm:text-3xl font-semibold text-blue-800 mt-2">
            {certificate.courses?.title}
          </h3>
        </div>

        {/* Divider */}
        <div className="mx-auto w-40 border-t-[4px] border-yellow-400 my-8 rounded-full" />

        {/* Description */}
        <p className="text-gray-700 mb-8 px-4 sm:px-12 leading-relaxed text-base sm:text-lg italic">
          {certificate.description ||
            "In recognition of exceptional performance, unwavering dedication, and remarkable mastery throughout this course."}
        </p>

        {/* Issued Info */}
        <div className="flex justify-between text-gray-700 text-xs sm:text-sm mt-8">
          <div>
            <p className="font-semibold text-gray-900 uppercase">Issued On</p>
            <p>
              {new Date(certificate.issued_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900 uppercase">Certificate ID</p>
            <p>{certificate.id}</p>
          </div>
        </div>

        {/* Signature & Seal */}
        <div className="mt-14 flex justify-between items-center">
          <div className="text-center">
            <div className="border-t-[2px] border-gray-500 w-40 mx-auto" />
            <p className="mt-2 text-xs text-gray-700">Authorized Signature</p>
          </div>

          {/* Luxury Seal */}
          <div className="relative w-24 h-24 rounded-full border-[6px] border-yellow-500 flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-yellow-300 font-bold text-base shadow-2xl rotate-[-2deg]">
            <span className="tracking-widest text-sm">SEAL</span>
            <div className="absolute inset-0 border-2 border-yellow-200 rounded-full opacity-40 animate-pulse" />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-10 flex justify-center gap-4">
          {certificate.certificate_url && (
            <a
              href={certificate.certificate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 text-gray-900 font-semibold rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all"
            >
              📜 View Original
            </a>
          )}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-900 text-yellow-300 font-semibold rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all"
          >
            🖨️ Print / Save
          </button>
        </div>

        {/* Bottom Gradient Border */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-blue-600 to-yellow-400 rounded-b-3xl shadow-inner" />
      </div>
    </div>
  );
}

export default CertificateDetail;
