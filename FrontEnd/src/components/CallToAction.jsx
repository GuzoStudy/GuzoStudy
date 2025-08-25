import { useNavigate } from 'react-router-dom';

function CallToAction() {
  const navigate = useNavigate();
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-blue-600 rounded-2xl px-8 py-12 text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8">
            Ready to start learning?
          </h2>
          
          <button 
            onClick={() => navigate('/signup')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Join Now
          </button>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;