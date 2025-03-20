document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("product-list");

    async function fetchMaterials() {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/materials");
            const materials = await response.json();

            console.log("Data dari API:", materials); // Debugging

            const limitedMaterials = materials.slice(0, 9);
            container.innerHTML = "";

            if (limitedMaterials.length === 0) {
                container.innerHTML = `<p class="text-gray-500 text-center col-span-3">Produk tidak tersedia</p>`;
                return;
            }

            limitedMaterials.forEach(material => {
                const card = document.createElement("div");
                card.className = "border border-gray-300 rounded-lg p-4 shadow-md bg-white flex flex-col justify-between";

                const name = material.title || "Nama tidak tersedia";
                const category = material.category || "Kategori tidak tersedia";
                const seller = material.seller || "Penjual tidak diketahui"; // API sekarang mengembalikan 'seller'
                const price = material.price ? `Rp ${material.price.toLocaleString()}` : "Harga tidak tersedia";

                card.innerHTML = `
                    <div class="flex justify-between items-center">
                        <a href="#" class="text-blue-600 font-semibold">${name}</a>
                        <button class="text-green-500 text-2xl font-bold">+</button>
                    </div>
                    <p class="text-gray-500 text-sm">${category}</p>
                    <p class="text-gray-400 text-xs">Penjual: ${seller}</p>
                    <p class="text-gray-900 font-semibold mt-2">${price}</p>
                `;

                container.appendChild(card);
            });

        } catch (error) {
            console.error("Error fetching materials:", error);
            container.innerHTML = `<p class="text-red-500 text-center col-span-3">Gagal memuat produk</p>`;
        }
    }

    fetchMaterials();
});
