// Shop Page JavaScript

class NURShop {
    constructor() {
        this.filteredProducts = [];
        this.currentFilters = {
            category: 'all',
            minPrice: 0,
            maxPrice: 10000,
            rating: 0,
            brands: [],
            inStock: false,
            freeShipping: false,
            sortBy: 'default'
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProducts();
    }

    setupEventListeners() {
        // Category filter
        document.querySelectorAll('.filter-list a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.dataset.category;
                this.filterByCategory(category);
                
                // Update active state
                document.querySelectorAll('.filter-list a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Price filter
        const applyPriceFilter = document.getElementById('apply-price-filter');
        if (applyPriceFilter) {
            applyPriceFilter.addEventListener('click', () => {
                const minPrice = parseInt(document.getElementById('min-price').value) || 0;
                const maxPrice = parseInt(document.getElementById('max-price').value) || 10000;
                this.filterByPrice(minPrice, maxPrice);
            });
        }

        // Rating filter
        document.querySelectorAll('.rating-filter a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const rating = parseInt(link.dataset.rating);
                this.filterByRating(rating);
            });
        });

        // Brand filter
        document.querySelectorAll('.brand-filter input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.filterByBrand();
            });
        });

        // Availability filters
        document.getElementById('in-stock')?.addEventListener('change', () => {
            this.filterByAvailability();
        });

        document.getElementById('free-shipping')?.addEventListener('change', () => {
            this.filterByAvailability();
        });

        // Sort options
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortProducts(e.target.value);
            });
        }

        // Reset filters
        const resetFilters = document.getElementById('reset-filters');
        if (resetFilters) {
            resetFilters.addEventListener('click', () => {
                this.resetFilters();
            });
        }
    }

    loadProducts() {
        // Get products from main app or load directly
        if (window.app && window.app.products) {
            this.filteredProducts = [...window.app.products];
            this.displayProducts();
        } else {
            // Fallback to sample products
            this.filteredProducts = this.getSampleProducts();
            this.displayProducts();
        }
    }

    getSampleProducts() {
        return window.app?.products || [
            // Same sample products as in app.js
            {
                id: '1',
                name: 'Premium Cotton T-Shirt',
                description: '100% Cotton, Premium Quality',
                price: 899,
                originalPrice: 1299,
                discount: 30,
                category: 'men',
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
                rating: 4.5,
                reviews: 128,
                sizes: ['S', 'M', 'L', 'XL'],
                stock: 50,
                isFlashSale: true,
                freeShipping: true
            },
            // ... add more sample products as needed
        ];
    }

    displayProducts() {
        const container = document.getElementById('shop-products');
        if (!container) return;

        if (this.filteredProducts.length === 0) {
            container.innerHTML = `
                <div class="no-products">
                    <svg width="64" height="64" viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search again</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredProducts.map(product => window.app.createProductCard(product)).join('');
        this.updateProductCount();
    }

    filterByCategory(category) {
        this.currentFilters.category = category;
        this.applyFilters();
    }

    filterByPrice(minPrice, maxPrice) {
        this.currentFilters.minPrice = minPrice;
        this.currentFilters.maxPrice = maxPrice;
        this.applyFilters();
    }

    filterByRating(rating) {
        this.currentFilters.rating = rating;
        this.applyFilters();
    }

    filterByBrand() {
        const checkboxes = document.querySelectorAll('.brand-filter input[type="checkbox"]:checked');
        this.currentFilters.brands = Array.from(checkboxes).map(cb => cb.value);
        this.applyFilters();
    }

    filterByAvailability() {
        const inStock = document.getElementById('in-stock')?.checked || false;
        const freeShipping = document.getElementById('free-shipping')?.checked || false;
        
        this.currentFilters.inStock = inStock;
        this.currentFilters.freeShipping = freeShipping;
        this.applyFilters();
    }

    applyFilters() {
        let filtered = this.getSampleProducts();

        // Category filter
        if (this.currentFilters.category !== 'all') {
            filtered = filtered.filter(product => product.category === this.currentFilters.category);
        }

        // Price filter
        filtered = filtered.filter(product => 
            product.price >= this.currentFilters.minPrice && 
            product.price <= this.currentFilters.maxPrice
        );

        // Rating filter
        if (this.currentFilters.rating > 0) {
            filtered = filtered.filter(product => product.rating >= this.currentFilters.rating);
        }

        // Brand filter (simplified - in real app, products would have brand property)
        if (this.currentFilters.brands.length > 0) {
            // This is a simplified implementation
            // In a real app, you would check product.brand
        }

        // Availability filters
        if (this.currentFilters.inStock) {
            filtered = filtered.filter(product => product.stock > 0);
        }

        if (this.currentFilters.freeShipping) {
            filtered = filtered.filter(product => product.freeShipping);
        }

        this.filteredProducts = filtered;
        
        // Apply current sort
        this.sortProducts(this.currentFilters.sortBy);
    }

    sortProducts(sortBy) {
        this.currentFilters.sortBy = sortBy;
        
        switch(sortBy) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                // Assuming products have a dateAdded property
                // this.filteredProducts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
                break;
            case 'popular':
                this.filteredProducts.sort((a, b) => b.reviews - a.reviews);
                break;
            default:
                // Keep original order
                break;
        }

        this.displayProducts();
    }

    updateProductCount() {
        const showingCount = document.getElementById('showing-count');
        const totalCount = document.getElementById('total-count');
        
        if (showingCount) {
            showingCount.textContent = this.filteredProducts.length;
        }
        
        if (totalCount) {
            const allProducts = this.getSampleProducts();
            totalCount.textContent = allProducts.length;
        }
    }

    resetFilters() {
        // Reset form inputs
        document.getElementById('min-price').value = 0;
        document.getElementById('max-price').value = 10000;
        
        document.querySelectorAll('.brand-filter input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        document.getElementById('in-stock').checked = false;
        document.getElementById('free-shipping').checked = false;
        
        document.querySelectorAll('.filter-list a').forEach(a => {
            a.classList.remove('active');
            if (a.dataset.category === 'all') {
                a.classList.add('active');
            }
        });

        // Reset filters object
        this.currentFilters = {
            category: 'all',
            minPrice: 0,
            maxPrice: 10000,
            rating: 0,
            brands: [],
            inStock: false,
            freeShipping: false,
            sortBy: 'default'
        };

        // Reset sort select
        document.getElementById('sort-select').value = 'default';

        // Reload all products
        this.filteredProducts = this.getSampleProducts();
        this.displayProducts();
    }
}

// Initialize shop when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.shop = new NURShop();
});
