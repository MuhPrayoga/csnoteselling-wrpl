document.addEventListener("DOMContentLoaded", async function () {
    const searchInput = document.querySelector('input[placeholder="Search..."]');
    const filterMatkul = document.querySelector('select');
    const minPriceInput = document.querySelector('input[placeholder="Min Price"]');
    const maxPriceInput = document.querySelector('input[placeholder="Max Price"]');
    const productContainer = document.querySelector(".col-span-3");
    const selectedFilterContainer = document.querySelector(".selected-filters"); // Ambil container filter terpilih

    let paginationContainer = document.querySelector(".pagination-container");
    if (!paginationContainer) {
        paginationContainer = document.createElement("div");
        paginationContainer.className = "w-full flex justify-center items-center mt-6 mb-10 space-x-2";
        productContainer.after(paginationContainer);
    }

    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get("q") || "";
    const selectedCourse = params.get("course") || "";
    const minPrice = params.get("minPrice") || "";
    const maxPrice = params.get("maxPrice") || "";
    let currentPage = parseInt(params.get("page")) || 1;
    const productsPerPage = 9;

    searchInput.value = searchQuery;
    filterMatkul.value = selectedCourse;
    minPriceInput.value = minPrice;
    maxPriceInput.value = maxPrice;

    async function fetchCourses() {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/courses");
            const courses = await response.json();

            filterMatkul.innerHTML = `<option value="">Mata Kuliah</option>`;
            courses.forEach(course => {
                const option = document.createElement("option");
                option.value = course.course_id;
                option.textContent = course.course_name;
                filterMatkul.appendChild(option);
            });

            if (selectedCourse) {
                filterMatkul.value = selectedCourse;
            }
        } catch (error) {
            console.error("Gagal mengambil data mata kuliah:", error);
        }
    }

    async function fetchProducts() {
        try {
            let apiUrl = `http://127.0.0.1:5000/api/materials?course=${selectedCourse}&q=${searchQuery}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
            const response = await fetch(apiUrl);
            const products = await response.json();
    
            productContainer.innerHTML = "";
            paginationContainer.innerHTML = "";
    
            // **Pastikan Selected Filter tetap ada meskipun hasil kosong**
            updateSelectedFilter();
    
            if (products.length === 0) {
                productContainer.innerHTML = `<p class="text-gray-500 text-center col-span-3">Produk tidak ditemukan</p>`;
                return;
            }
    
            const totalPages = Math.ceil(products.length / productsPerPage);
            const start = (currentPage - 1) * productsPerPage;
            const paginatedProducts = products.slice(start, start + productsPerPage);
    
            paginatedProducts.forEach(product => {
                const productCard = document.createElement("div");
                productCard.className = "bg-white p-4 rounded-lg shadow-md flex justify-between";
    
                productCard.innerHTML = `
                    <div>
                        <h3 class="text-blue-700 font-bold">${product.title}</h3>
                        <p class="text-gray-600 text-sm">${product.category || "Kategori tidak tersedia"}</p>
                        <p class="text-gray-500 text-sm">${product.description}</p>
                        <p class="font-bold">Rp ${product.price.toLocaleString()}</p>
                    </div>
                    <button class="text-2xl">🛒</button>
                `;
    
                productContainer.appendChild(productCard);
            });
    
            setupPagination(totalPages, currentPage);
        } catch (error) {
            console.error("Gagal mengambil produk:", error);
        }
    }
    
    

    function setupPagination(totalPages, currentPage) {
        paginationContainer.innerHTML = "";

        if (currentPage > 1) {
            const prevButton = document.createElement("button");
            prevButton.textContent = "«";
            prevButton.className = "px-4 py-2 rounded bg-white border border-gray-300 hover:bg-blue-400 hover:text-white transition";
            prevButton.addEventListener("click", () => {
                params.set("page", currentPage - 1);
                window.location.search = params.toString();
            });
            paginationContainer.appendChild(prevButton);
        }

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.textContent = i;
            pageButton.className = `px-4 py-2 rounded border border-gray-300 ${
                i === currentPage ? 'bg-blue-600 text-white font-bold' : 'bg-white hover:bg-blue-500 hover:text-white'
            }`;
            pageButton.addEventListener("click", () => {
                params.set("page", i);
                window.location.search = params.toString();
            });
            paginationContainer.appendChild(pageButton);
        }

        if (currentPage < totalPages) {
            const nextButton = document.createElement("button");
            nextButton.textContent = "»";
            nextButton.className = "px-4 py-2 rounded bg-white border border-gray-300 hover:bg-blue-400 hover:text-white transition";
            nextButton.addEventListener("click", () => {
                params.set("page", currentPage + 1);
                window.location.search = params.toString();
            });
            paginationContainer.appendChild(nextButton);
        }
    }

    function updateSelectedFilter() {
        selectedFilterContainer.innerHTML = ""; // Kosongkan filter sebelum diperbarui
    
        const filters = [
            { key: "q", label: "Searching", value: searchQuery },
            { key: "course", label: "Kategori Matkul", value: selectedCourse ? filterMatkul.options[filterMatkul.selectedIndex].text : "" },
            { key: "minPrice", label: "Min Price", value: minPrice ? `Rp ${parseInt(minPrice).toLocaleString()}` : "" },
            { key: "maxPrice", label: "Max Price", value: maxPrice ? `Rp ${parseInt(maxPrice).toLocaleString()}` : "" }
        ];
    
        filters.forEach(filter => {
            if (filter.value) {
                const filterItem = document.createElement("div");
                filterItem.className = "flex justify-between bg-gray-200 p-2 rounded-lg";
                filterItem.innerHTML = `
                    <span>${filter.label}: ${filter.value}</span>
                    <button class="text-red-500">✖</button>
                `;
    
                // Event listener untuk menghapus filter
                filterItem.querySelector("button").addEventListener("click", () => {
                    params.delete(filter.key);  // Hapus filter dari URL
                    params.set("page", 1);  // Reset ke halaman pertama setelah filter dihapus
                    window.location.search = params.toString();  // Perbarui halaman
                });
    
                selectedFilterContainer.appendChild(filterItem);
            }
        });
    }
    

    document.querySelectorAll("select, input").forEach(element => {
        element.addEventListener("change", function () {
            params.set("q", searchInput.value);
            params.set("course", filterMatkul.value);
            params.set("minPrice", minPriceInput.value);
            params.set("maxPrice", maxPriceInput.value);
            params.set("page", 1);
            window.location.search = params.toString();
        });
    });

    fetchCourses();
    fetchProducts();
});
