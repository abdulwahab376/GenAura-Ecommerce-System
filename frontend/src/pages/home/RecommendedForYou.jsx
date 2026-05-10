import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useFetchAllProductsQuery } from "../../redux/features/products/productsApi";
import { getTopCategories, trackClick } from "../../utils/trackBehavior";

const RECOMMEND_COUNT = 12; // Change this number to show more/fewer products

const RecommendedForYou = () => {
  const { data, isLoading } = useFetchAllProductsQuery({
    category: "",
    mainCategory: "",
    color: "",
    minPrice: 0,
    maxPrice: "",
    page: 1,
    limit: 100,
  });

  const [recommended, setRecommended] = useState([]);
  const [aiLoading, setAiLoading] = useState(true);

  useEffect(() => {
    if (!data?.products) return;
    const allProducts = data.products;

    const run = async () => {
      try {
        const topCats = getTopCategories(3);

        if (topCats.length === 0) {
          const fallback = [...allProducts]
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, RECOMMEND_COUNT);
          setRecommended(fallback);
          return;
        }

        const productList = allProducts
          .map((p) => `${p._id}|${p.name}|${p.category}`)
          .join("\n");

        const prompt = `User likes these categories: ${topCats.join(", ")}.
From this product list (format: id|name|category), pick the ${RECOMMEND_COUNT} BEST matches.
Reply ONLY with comma-separated IDs, nothing else.

${productList}`;

        const groqRes = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
          },
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        const ids = groqRes.data.choices[0].message.content
          .split(",")
          .map((s) => s.trim());

        const matched = allProducts.filter((p) => ids.includes(p._id));
        setRecommended(
          matched.length > 0 ? matched : allProducts.slice(0, RECOMMEND_COUNT)
        );
      } catch (err) {
        console.error("Groq error:", err);
        setRecommended(allProducts.slice(0, RECOMMEND_COUNT));
      } finally {
        setAiLoading(false);
      }
    };

    run();
  }, [data]);

  if (isLoading || aiLoading) {
    return (
      <div className="text-center py-10 font-black uppercase tracking-[4px] text-slate-300">
        Loading Recommendations...
      </div>
    );
  }
  if (recommended.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 mb-1">
            Recommended For You
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto mb-3"></div>
          <p className="text-gray-500 font-medium text-[12px] uppercase tracking-[2px]">
            Picked just for you — based on your interests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommended.map((p) => {
            const productImage = Array.isArray(p?.image) ? p.image[0] : p?.image;
            return (
              <Link
                to={`/shop/${p._id}`}
                key={p._id}
                onClick={() => trackClick(p.category)}
                className="bg-white rounded-[20px] overflow-hidden shadow-xl shadow-slate-100 hover:shadow-indigo-50 transition-all duration-500 border border-slate-100 flex flex-col group"
              >
                <div className="relative h-64 overflow-hidden bg-white">
                  <img
                    src={productImage}
                    alt={p.name}
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                    For You
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter mb-1 line-clamp-1 group-hover:text-red-600 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xl font-black text-red-600 tracking-tighter mt-2">
                    Rs. {p.price}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecommendedForYou;