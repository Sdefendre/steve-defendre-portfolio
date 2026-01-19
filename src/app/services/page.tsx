import {
  RocketLaunchIcon,
  CpuChipIcon,
  ArrowPathIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

const services = [
  {
    icon: RocketLaunchIcon,
    title: "Quick Wins",
    description: "Get your business online fast with professional website launches and landing pages that convert visitors into customers.",
    features: ["Website Development", "Landing Pages", "E-commerce Setup", "Performance Optimization"],
    gradient: "from-orange-500 to-amber-600"
  },
  {
    icon: CpuChipIcon,
    title: "AI Solutions",
    description: "Leverage the power of artificial intelligence to automate processes and enhance customer experiences.",
    features: ["Custom AI Chatbots", "Process Automation", "Data Analysis", "Integration Services"],
    gradient: "from-indigo-500 to-purple-600"
  },
  {
    icon: ArrowPathIcon,
    title: "Modernization",
    description: "Update your existing systems to meet current standards and improve efficiency across your organization.",
    features: ["Code Updates", "Tech Stack Consultation", "Legacy System Migration", "Security Audits"],
    gradient: "from-emerald-500 to-teal-600"
  },
];

export default function Services() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Services</h1>
      <p className="text-base text-gray-600 mb-8 max-w-xl">
        Veteran-owned software development services designed to help small
        businesses compete in the digital landscape.
      </p>

      <div className="flex flex-col gap-6 mb-12">
        {services.map((service) => (
          <div
            key={service.title}
            className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${service.gradient} flex items-center justify-center flex-shrink-0`}>
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 ml-16">
              {service.features.map((feature) => (
                <span
                  key={feature}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl text-white">
        <h3 className="text-lg font-semibold mb-2">Ready to get started?</h3>
        <p className="text-gray-300 text-sm mb-4">
          Let&apos;s discuss how I can help transform your business with technology.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          Get in Touch
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
