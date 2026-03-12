import React from "react";
import { useNavigate } from "react-router-dom";
import { FadeInUpOnScroll } from "./AnimationUtils";

const DiscoverProducts: React.FC = () => {
  const navigate = useNavigate();
  
  const products = [
    {
      image: "/images/DTMP Mockup.png",
      title: "Digital Transformation Management Platform",
      description: "Manage and accelerate digital transformation",
      route: "/products/dtmp" // DTMP goes to DTMP product page
    },
    {
      image: "/images/TMaaS Mockup.png",
      title: "Transformation Management as a Service",
      description: "Digital transformation services self-service marketplace",
      route: "/products/tmaas" // TMaaS goes to TMaaS product page
    },
    {
      image: "/images/DTMA Mockup.png",
      title: "Digital Transformation Management Academy",
      description: "Equip your team to thrive in the digital economy",
      route: "/products/dtma" // DTMA goes to DTMA product page
    }
  ];

  const handleViewAll = () => {
    navigate("/products"); // View All goes to products marketplace
  };

  const handleProductClick = (route: string) => {
    navigate(route);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <FadeInUpOnScroll>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Services and Products to Boost Your Transformation
            </h2>
            <p className="text-lg text-gray-600">
              DQ offers products and services that accelerate your digital transformation, empowering your team and driving sustainable growth.
            </p>
          </div>
        </FadeInUpOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <FadeInUpOnScroll key={index} delay={index * 0.1}>
              <div 
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                onClick={() => handleProductClick(product.route)}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {product.description}
                  </p>
                  <button 
                    className="text-primary font-medium hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product.route);
                    }}
                  >
                    Learn more →
                  </button>
                </div>
              </div>
            </FadeInUpOnScroll>
          ))}
        </div>

        <FadeInUpOnScroll delay={0.3}>
          <div className="mt-12 text-center">
            <button 
              onClick={handleViewAll}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-all"
            >
              View All
            </button>
          </div>
        </FadeInUpOnScroll>
      </div>
    </section>
  );
};

export default DiscoverProducts;