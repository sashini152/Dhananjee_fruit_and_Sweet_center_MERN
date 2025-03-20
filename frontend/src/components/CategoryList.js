import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SummaryApi from '../common';

const CategoryList = () => {
    const [categoryProduct, setCategoryProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const categoryLoading = new Array(10).fill(null); // Skeleton loaders

    // Fetch category products with error handling
    const fetchCategoryProduct = useCallback(async () => {
        setLoading(true);
        setError(null); // Reset error state
        
        const controller = new AbortController(); // To prevent memory leaks
        const signal = controller.signal;

        try {
            const response = await fetch(SummaryApi.categoryProduct.url, { signal });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const dataResponse = await response.json();
            setCategoryProduct(dataResponse?.data || dataResponse);
        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }

        return () => controller.abort(); // Cleanup on unmount
    }, []);

    useEffect(() => {
        fetchCategoryProduct();
    }, [fetchCategoryProduct]);

    return (
        <div className="container mx-auto p-4">
            {/* Error Handling */}
            {error && (
                <div className="text-red-500 text-center">
                    <p>{error}</p>
                    <button
                        className="bg-red-600 text-white px-4 py-2 mt-2 rounded-md hover:bg-red-700"
                        onClick={fetchCategoryProduct}
                    >
                        Retry
                    </button>
                </div>
            )}

            <div className="flex items-center gap-4 justify-between overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
                {/* Show Skeleton Loaders while loading */}
                {loading ? (
                    categoryLoading.map((_, index) => (
                        <div
                            key={`categoryLoading${index}`}
                            className="h-16 w-16 md:w-20 md:h-20 rounded-full bg-gray-200 animate-pulse"
                        ></div>
                    ))
                ) : categoryProduct.length > 0 ? (
                    categoryProduct.map((product, index) => (
                        <Link
                            to={`/product-category?category=${product?.category}`}
                            className="cursor-pointer"
                            key={product?.category || index}
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                <img
                                    src={product?.productImage?.[0] || '/placeholder.jpg'}
                                    alt={product?.category || 'Category'}
                                    className="h-full object-contain mix-blend-multiply hover:scale-110 transition-all"
                                    loading="lazy"
                                />
                            </div>
                            <p className="text-center text-sm md:text-base capitalize">
                                {product?.category || 'Unknown'}
                            </p>
                        </Link>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No categories found.</p>
                )}
            </div>
        </div>
    );
};

export default CategoryList;
