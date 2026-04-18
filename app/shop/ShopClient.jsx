"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "../components/ProductCard";
import { FiSearch, FiX, FiSliders, FiGrid, FiChevronDown, FiChevronUp } from "react-icons/fi";

const INITIAL_VISIBLE = 20;
const LOAD_MORE_COUNT = 12;

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest First", value: "newest" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
  { label: "Name A → Z", value: "name-asc" },
];

const FABRICS = [
  "All","Chiffon","Georgette","Chanderi","Organza","Crepe","Silk",
  "Linen Blend","Cotton","Kota Doria","Tissue",
];

export default function ShopClient({ products, initialCollection, initialSearch, initialSort }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [collection, setCollection] = useState(initialCollection);
  const [sort, setSort] = useState(initialSort);
  const [fabric, setFabric] = useState("All");
  const [priceMax, setPriceMax] = useState(5000);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [gridCols, setGridCols] = useState(4);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  useEffect(() => {
    fetch("/api/collections")
      .then(r => r.json())
      .then(d => { if (d.success) setCategories(d.collections); })
      .catch(() => {});
  }, []);

  useEffect(() => { setVisibleCount(INITIAL_VISIBLE); }, [search, collection, fabric, priceMax, sort]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (collection) params.set("collection", collection);
    if (search) params.set("search", search);
    if (sort !== "featured") params.set("sort", sort);
    const query = params.toString();
    router.replace(query ? `/shop?${query}` : "/shop", { scroll: false });
  }, [collection, search, sort]);

  const collectionOptions = [
    { label: "All", value: "" },
    ...categories.map(c => ({ label: c.name, value: c.handle })),
  ];

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.fabric?.toLowerCase().includes(q) || p.tags?.some(t => t.toLowerCase().includes(q)));
    }
    if (collection) list = list.filter(p => p.collections?.includes(collection));
    if (fabric !== "All") list = list.filter(p => p.fabric === fabric);
    list = list.filter(p => p.price <= priceMax);
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "newest": list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      case "name-asc": list.sort((a, b) => a.title.localeCompare(b.title)); break;
      default: list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)); break;
    }
    return list;
  }, [products, search, collection, fabric, priceMax, sort]);

  const visibleProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const canCollapse = visibleCount > INITIAL_VISIBLE;

  const activeFilterCount = [collection, fabric !== "All" ? fabric : null, priceMax < 5000 ? priceMax : null].filter(Boolean).length;

  const clearAllFilters = () => { setSearch(""); setCollection(""); setFabric("All"); setPriceMax(5000); setSort("featured"); };

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <p className="text-xs text-[var(--secondary)] font-semibold tracking-widest uppercase mb-2">Qalbi Couture</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900" style={{ fontFamily: "var(--font-cormorant)" }}>All Collections</h1>
          <p className="text-gray-500 text-sm mt-2">{filtered.length} of {products.length} products</p>
        </div>
      </div>

      {/* Sticky toolbar */}
      <div className="sticky top-[60px] z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-xs sm:max-w-sm">
              <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--secondary)] focus:bg-white transition-all" />
              {search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2"><FiX size={13} className="text-gray-400 hover:text-gray-600" /></button>}
            </div>

            {/* Collection pills — desktop */}
            <div className="hidden md:flex items-center gap-1.5 flex-1 overflow-x-auto no-scrollbar">
              {collectionOptions.map(c => (
                <button key={c.value} onClick={() => setCollection(c.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${collection === c.value ? "bg-[var(--secondary)] text-white border-[var(--secondary)]" : "bg-white border-gray-200 text-gray-600 hover:border-[var(--secondary)] hover:text-[var(--secondary)]"}`}>
                  {c.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="relative flex-shrink-0">
              <select value={sort} onChange={e => setSort(e.target.value)} className="appearance-none pl-3 pr-7 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:border-[var(--secondary)] cursor-pointer">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <FiChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter button */}
            <button onClick={() => setFiltersOpen(!filtersOpen)}
              className={`relative flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${filtersOpen || activeFilterCount > 0 ? "border-[var(--secondary)] text-[var(--secondary)] bg-red-50" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
              <FiSliders size={14} />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[var(--secondary)] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{activeFilterCount}</span>}
            </button>

            {/* Grid toggle desktop */}
            <div className="hidden lg:flex items-center gap-1 border border-gray-200 rounded-xl p-1">
              {[3, 4].map(cols => (
                <button key={cols} onClick={() => setGridCols(cols)} className={`p-1.5 rounded-lg transition-colors ${gridCols === cols ? "bg-gray-100" : "hover:bg-gray-50"}`}>
                  <FiGrid size={14} className="text-gray-500" />
                </button>
              ))}
            </div>
          </div>

          {/* Expanded filters */}
          {filtersOpen && (
            <div className="mt-3 pt-3 border-t border-gray-100 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Mobile collection filter */}
              <div className="md:hidden">
                <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Collection</p>
                <div className="flex gap-1.5 flex-wrap">
                  {collectionOptions.map(c => (
                    <button key={c.value} onClick={() => setCollection(c.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${collection === c.value ? "bg-[var(--secondary)] text-white border-[var(--secondary)]" : "border-gray-200 text-gray-600 hover:border-[var(--secondary)]"}`}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabric */}
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Fabric</p>
                <div className="flex gap-1.5 flex-wrap">
                  {FABRICS.map(f => (
                    <button key={f} onClick={() => setFabric(f)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${fabric === f ? "bg-[var(--secondary)] text-white border-[var(--secondary)]" : "border-gray-200 text-gray-600 hover:border-[var(--secondary)]"}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Max Price: <span className="text-[var(--secondary)]">₹{priceMax.toLocaleString("en-IN")}</span></p>
                <input type="range" min={2000} max={5000} step={100} value={priceMax} onChange={e => setPriceMax(Number(e.target.value))} className="w-full accent-[var(--secondary)] h-1.5" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>₹2,000</span><span>₹5,000</span></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active filter chips */}
      {(activeFilterCount > 0 || search) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 flex items-center gap-2 flex-wrap">
          {collection && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-[var(--secondary)] rounded-full text-xs font-medium border border-red-100">{collectionOptions.find(c => c.value === collection)?.label || collection}<button onClick={() => setCollection("")}><FiX size={11} /></button></span>}
          {fabric !== "All" && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-[var(--secondary)] rounded-full text-xs font-medium border border-red-100">{fabric}<button onClick={() => setFabric("All")}><FiX size={11} /></button></span>}
          {priceMax < 5000 && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-[var(--secondary)] rounded-full text-xs font-medium border border-red-100">Under ₹{priceMax.toLocaleString("en-IN")}<button onClick={() => setPriceMax(5000)}><FiX size={11} /></button></span>}
          {search && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-[var(--secondary)] rounded-full text-xs font-medium border border-red-100">"{search}"<button onClick={() => setSearch("")}><FiX size={11} /></button></span>}
          <button onClick={clearAllFilters} className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2">Clear all</button>
        </div>
      )}

      {/* Products grid */}
      <div id="products-grid" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-600 font-medium text-lg">No products found</p>
            <p className="text-sm text-gray-400 mt-1 mb-6">Try adjusting your filters or search term</p>
            <button onClick={clearAllFilters} className="px-6 py-3 bg-[var(--secondary)] text-white rounded-xl font-medium text-sm hover:bg-[#c03535] transition-colors">Clear All Filters</button>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-4 sm:hidden">{filtered.length} products</p>
            <div className={`grid grid-cols-2 gap-3 sm:gap-4 ${gridCols === 3 ? "lg:grid-cols-3" : "sm:grid-cols-3 lg:grid-cols-4"}`}>
              {visibleProducts.map(product => <ProductCard key={product._id} product={product} />)}
            </div>
            {(hasMore || canCollapse) && (
              <div className="mt-10 flex flex-col items-center gap-3">
                <p className="text-xs text-gray-400">Showing <span className="font-semibold text-gray-600">{visibleProducts.length}</span> of <span className="font-semibold text-gray-600">{filtered.length}</span> products</p>
                <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--secondary)] rounded-full transition-all duration-500" style={{ width: `${(visibleProducts.length / filtered.length) * 100}%` }} />
                </div>
                <div className="flex items-center gap-3 mt-1">
                  {hasMore && <button onClick={() => setVisibleCount(v => v + LOAD_MORE_COUNT)} className="flex items-center gap-2 px-6 py-2.5 bg-[var(--secondary)] text-white rounded-xl text-sm font-medium hover:bg-[#c03535] transition-all active:scale-95"><FiChevronDown size={15} /> View More (+{Math.min(LOAD_MORE_COUNT, filtered.length - visibleCount)})</button>}
                  {canCollapse && <button onClick={() => { setVisibleCount(INITIAL_VISIBLE); document.getElementById("products-grid")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="flex items-center gap-2 px-6 py-2.5 bg-white text-gray-600 border border-gray-200 rounded-xl text-sm font-medium hover:border-gray-300 transition-all active:scale-95"><FiChevronUp size={15} /> View Less</button>}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
