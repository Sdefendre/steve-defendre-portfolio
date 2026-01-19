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
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 lg:mb-4">Services</h1>
      <p className="text-sm lg:text-base text-gray-600 mb-6 lg:mb-8">
        Veteran-owned software development services designed to help small
        businesses compete in the digital landscape.
      </p>

      <div className="flex flex-col gap-4 lg:gap-6 mb-8 lg:mb-12">
        {services.map((service) => (
          <div
            key={service.title}
            className="p-4 lg:p-6 bg-white rounded-xl border border-gray-100 lg:border-gray-200"
          >
            <div className="flex items-start gap-3 lg:gap-4 mb-3 lg:mb-4">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-br ${service.gradient} flex items-center justify-center flex-shrink-0`}>
                <service.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-1 lg:mb-2">{service.title}</h3>
                <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 lg:ml-14">
              {service.features.map((feature) => (
                <span
                  key={feature}
                  className="px-2.5 py-1 bg-gray-50 lg:bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="p-5 lg:p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl text-white">
        <h3 className="text-base lg:text-lg font-semibold mb-2">Ready to get started?</h3>
        <p className="text-gray-300 text-xs lg:text-sm mb-4">
          Let&apos;s discuss how I can help transform your business with technology.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium active:scale-95 transition-transform"
        >
          Get in Touch
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
