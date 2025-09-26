import { Link } from "react-router-dom";

export default function AboutPage() {
  const faqs = [
    {
      question: "How do I report something?",
      answer:
        "Sign in, click 'Create Report,' and share as many details as you can about your lost or found item. The more info, the better your chances of reconnecting with your things.",
    },
    {
      question: "What happens after I post?",
      answer:
        "Once your report is live, others can see it and reply if they have info. You'll get a notification when someone responds, so you can connect and sort things out quickly.",
    },
    {
      question: "Can I update or close my report?",
      answer:
        "Yes! If your item is found or returned, you can update or close your report anytime from your dashboard. Stay in control every step of the way.",
    },
    {
      question: "Is my information safe?",
      answer:
        "Your privacy is important. Only the details you choose to share are visible to others, and you decide what's shown on your reports.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="flex justify-center items-center">
        <nav className="flex justify-center items-center min-h-[20vh]">
          <a
            href="#"
            className="relative text-lg text-gray-600 px-5 py-2 mx-2 transition-all duration-500 hover:text-cyan-400"
          >
            <Link to="/">Home</Link>
          </a>
          <a
            href="#"
            className="relative text-lg text-gray-600 px-5 py-2 mx-2 transition-all duration-500 hover:text-cyan-400"
          >
            <Link to="/about">About</Link>
          </a>
          <a
            href="#"
            className="relative text-lg text-gray-600 px-5 py-2 mx-2 transition-all duration-500 hover:text-cyan-400"
          >
            <Link to="/reports">Reports</Link>
          </a>
        </nav>
      </div>

      <div className="flex relative flex-col w-full justify-center items-center ml-auto px-4">
        <div className="flex flex-col w-full max-w-[1300px] justify-center items-start mb-9 text-center sm:text-left">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
            LOST
          </h1>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
            SOMETHING?
          </h1>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
            FIND IT HERE.
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row justify-start w-full max-w-[1300px] gap-8 sm:gap-14">
          <div className="w-full sm:w-[350px] text-base sm:text-lg">
            Report lost or found items in seconds. Connect with your campus
            community and help reunite people with their belongings.
          </div>
          <div className="w-full sm:w-[350px] text-base sm:text-lg">
            Share details, reply to posts, and close reports when items are
            returned. Every post brings us closer together.
          </div>
        </div>
      </div>

      <section className="bg-black text-white py-16 px-6 md:px-20">
        <div className="grid md:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Questions? We've got answers
            </h2>
            <p className="text-gray-300 mb-6">
              Curious about how lost and found works here? Explore our most
              common questions to get started, connect, and help your campus
              community reunite with their belongings.
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded font-medium">
              <Link to="/auth">Get Started</Link>
            </button>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
                <div className="border-b border-gray-700 mt-4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
