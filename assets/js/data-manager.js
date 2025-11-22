// Real Data Management System
class DataManager {
    constructor() {
        this.db = firebase.firestore();
        this.products = [];
        this.productStats = {};
    }

    // Initialize Data Manager
    async init() {
        await this.loadProducts();
        await this.loadProductStats();
    }

    // Load Products from Firestore
    async loadProducts() {
        try {
            const snapshot = await this.db.collection('products')
                .where('isActive', '==', true)
                .orderBy('createdAt', 'desc')
                .get();
            
            this.products = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            return this.products;
        } catch (error) {
            console.error('Error loading products:', error);
            return [];
        }
    }

    // Load Product Statistics
    async loadProductStats() {
        try {
            const snapshot = await this.db.collection('productStats').get();
            
            snapshot.forEach(doc => {
                this.productStats[doc.id] = doc.data();
            });
            
            return this.productStats;
        } catch (error) {
            console.error('Error loading product stats:', error);
            return {};
        }
    }

    // Get Product with Real Statistics
    async getProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return null;

        const stats = this.productStats[productId] || {
            totalSold: 0,
            averageRating: 0,
            reviewCount: 0
        };

        return {
            ...product,
            sold: stats.totalSold || 0,
            rating: stats.averageRating || 0,
            reviews: stats.reviewCount || 0,
            realStats: stats
        };
    }

    // Get Product Reviews
    async getProductReviews(productId, limit = 10) {
        try {
            const snapshot = await this.db.collection('reviews')
                .where('productId', '==', productId)
                .where('isVerified', '==', true)
                .orderBy('createdAt', 'desc')
                .limit(limit)
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error loading reviews:', error);
            return [];
        }
    }

    // Add Product Review (Only for verified purchasers)
    async addReview(productId, rating, comment, images = []) {
        const user = firebase.auth().currentUser;
        if (!user) throw new Error('User not authenticated');

        // Check if user purchased this product
        const hasPurchased = await this.verifyPurchase(user.uid, productId);
        if (!hasPurchased) {
            throw new Error('You can only review products you have purchased');
        }

        const reviewData = {
            productId,
            userId: user.uid,
            rating,
            comment,
            images,
            isVerified: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Add review
        await this.db.collection('reviews').add(reviewData);

        // Update product statistics
        await this.updateProductStats(productId);

        return reviewData;
    }

    // Verify if user purchased the product
    async verifyPurchase(userId, productId) {
        try {
            const snapshot = await this.db.collection('orders')
                .where('userId', '==', userId)
                .where('status', '==', 'delivered')
                .get();

            for (const doc of snapshot.docs) {
                const order = doc.data();
                const hasProduct = order.items.some(item => item.productId === productId);
                if (hasProduct) return true;
            }

            return false;
        } catch (error) {
            console.error('Error verifying purchase:', error);
            return false;
        }
    }

    // Update Product Statistics
    async updateProductStats(productId) {
        try {
            // Get all verified reviews for this product
            const reviewsSnapshot = await this.db.collection('reviews')
                .where('productId', '==', productId)
                .where('isVerified', '==', true)
                .get();

            const reviews = reviewsSnapshot.docs.map(doc => doc.data());
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

            // Get total sold from orders
            const ordersSnapshot = await this.db.collection('orders')
                .where('items', 'array-contains', { productId })
                .where('status', '==', 'delivered')
                .get();

            const totalSold = ordersSnapshot.size;

            // Update product stats
            await this.db.collection('productStats').doc(productId).set({
                totalSold,
                averageRating,
                reviewCount: reviews.length,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

        } catch (error) {
            console.error('Error updating product stats:', error);
        }
    }

    // Get Related Products
    async getRelatedProducts(productId, category, limit = 4) {
        try {
            const snapshot = await this.db.collection('products')
                .where('category', '==', category)
                .where('isActive', '==', true)
                .where('id', '!=', productId)
                .limit(limit)
                .get();

            const products = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Add statistics to each product
            const productsWithStats = await Promise.all(
                products.map(async (product) => {
                    const stats = this.productStats[product.id] || {
                        totalSold: 0,
                        averageRating: 0,
                        reviewCount: 0
                    };
                    
                    return {
                        ...product,
                        sold: stats.totalSold || 0,
                        rating: stats.averageRating || 0,
                        reviews: stats.reviewCount || 0
                    };
                })
            );

            return productsWithStats;
        } catch (error) {
            console.error('Error loading related products:', error);
            return [];
        }
    }

    // Search Products
    async searchProducts(query, filters = {}) {
        try {
            let productsRef = this.db.collection('products')
                .where('isActive', '==', true);

            // Add search query
            if (query) {
                // Note: Firestore doesn't support full-text search natively
                // In production, you might want to use Algolia or ElasticSearch
                productsRef = productsRef.where('name', '>=', query)
                    .where('name', '<=', query + '\uf8ff');
            }

            // Add category filter
            if (filters.category) {
                productsRef = productsRef.where('category', '==', filters.category);
            }

            // Add price range filter
            if (filters.maxPrice) {
                productsRef = productsRef.where('price', '<=', filters.maxPrice);
            }

            const snapshot = await productsRef.get();
            const products = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Add statistics to products
            const productsWithStats = await Promise.all(
                products.map(async (product) => {
                    const stats = this.productStats[product.id] || {
                        totalSold: 0,
                        averageRating: 0,
                        reviewCount: 0
                    };
                    
                    return {
                        ...product,
                        sold: stats.totalSold || 0,
                        rating: stats.averageRating || 0,
                        reviews: stats.reviewCount || 0
                    };
                })
            );

            return productsWithStats;
        } catch (error) {
            console.error('Error searching products:', error);
            return [];
        }
    }
}

// Initialize Data Manager
const dataManager = new DataManager();

// Export for global use
window.dataManager = dataManager;
