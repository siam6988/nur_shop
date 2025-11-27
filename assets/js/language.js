// Language Support for NUR Shopping
class NURLanguage {
    constructor() {
        this.currentLang = localStorage.getItem('nur_language') || 'bn';
        this.translations = {
            'bn': {
                // Header & Navigation
                'header_promo': 'NUR - প্রিমিয়াম শপিং এক্সপেরিয়েন্স | দ্রুত ডেলিভারি গ্যারান্টি',
                'search_placeholder': 'পণ্য খুঁজুন...',
                'wishlist': 'উইশলিস্ট',
                'account': 'অ্যাকাউন্ট',
                'cart': 'কার্ট',
                'all_categories': 'সব ক্যাটাগরি',
                'home': 'হোম',
                'shop': 'শপ',
                'about': 'আমাদের সম্পর্কে',
                'contact': 'যোগাযোগ',
                'offers': 'অফার',

                // Banner
                'banner1_title': 'সামার সেল ২০২৩',
                'banner1_desc': 'সব পণ্যে ৭০% পর্যন্ত ছাড়',
                'banner2_title': 'নতুন পণ্য',
                'banner2_desc': 'সবচেয়ে নতুন ট্রেন্ডগুলো দেখুন',
                'banner3_title': 'ইলেকট্রনিক্স সেল',
                'banner3_desc': 'প্রিমিয়াম গ্যাজেট আকর্ষণীয় দামে',
                'shop_now': 'এখনই কিনুন',
                'explore': 'এক্সপ্লোর করুন',
                'buy_now': 'কিনুন',

                // Categories
                'shop_by_category': 'ক্যাটাগরি অনুযায়ী শপ করুন',
                'electronics': 'ইলেকট্রনিক্স',
                'fashion': 'ফ্যাশন',
                'home_kitchen': 'হোম ও কিচেন',
                'beauty': 'বিউটি',
                'sports': 'স্পোর্টস',

                // Products
                'featured_products': 'ফিচার্ড পণ্য',
                'add_to_cart': 'কার্টে যোগ করুন',

                // Offers
                'special_offers': 'বিশেষ অফার',
                'free_shipping': 'ফ্রি শিপিং',
                'free_shipping_desc': '১০০০ টাকার বেশি অর্ডারে',
                'loyalty_points': 'লয়্যালটি পয়েন্ট',
                'loyalty_points_desc': 'প্রতিটি কেনাকাটায় পয়েন্ট অর্জন করুন',
                'cashback': 'ক্যাশব্যাক ১০%',
                'cashback_desc': 'আপনার প্রথম অর্ডারে',
                'save_more': 'আরও সাশ্রয় করুন',
                'earn_rewards': 'রিওয়ার্ড অর্জন করুন',
                'new_user': 'নতুন ইউজার',

                // Footer
                'nur_shopping': 'NUR শপিং',
                'about_us': 'আমাদের সম্পর্কে',
                'contact_us': 'যোগাযোগ করুন',
                'careers': 'ক্যারিয়ার',
                'blog': 'ব্লগ',
                'customer_service': 'গ্রাহক সেবা',
                'help_center': 'হেল্প সেন্টার',
                'returns_refunds': 'রিটার্ন ও রিফান্ড',
                'shipping_info': 'শিপিং তথ্য',
                'size_guide': 'সাইজ গাইড',
                'policies': 'পলিসি',
                'privacy_policy': 'প্রাইভেসি পলিসি',
                'terms_service': 'সেবার শর্তাবলী',
                'cookie_policy': 'কুকি পলিসি',
                'faq': 'সচরাচর জিজ্ঞাসা',
                'contact_info': 'যোগাযোগ তথ্য',
                'phone': 'ফোন: +৮৮০ ১২৩৪-৫৬৭৮৯০',
                'address': 'ঠিকানা: ১২৩ শপিং স্ট্রিট, ঢাকা',
                'copyright': 'কপিরাইট © ২০২৩ NUR - প্রিমিয়াম শপিং। সর্বস্বত্ব সংরক্ষিত।'
            },
            'en': {
                // Header & Navigation
                'header_promo': 'NUR - Premium Shopping Experience | Fast Delivery Guaranteed',
                'search_placeholder': 'Search products...',
                'wishlist': 'Wishlist',
                'account': 'Account',
                'cart': 'Cart',
                'all_categories': 'All Categories',
                'home': 'Home',
                'shop': 'Shop',
                'about': 'About',
                'contact': 'Contact',
                'offers': 'Offers',

                // Banner
                'banner1_title': 'Summer Sale 2023',
                'banner1_desc': 'Up to 70% OFF on all products',
                'banner2_title': 'New Arrivals',
                'banner2_desc': 'Discover the latest trends',
                'banner3_title': 'Electronics Sale',
                'banner3_desc': 'Premium gadgets at amazing prices',
                'shop_now': 'Shop Now',
                'explore': 'Explore',
                'buy_now': 'Buy Now',

                // Categories
                'shop_by_category': 'Shop by Category',
                'electronics': 'Electronics',
                'fashion': 'Fashion',
                'home_kitchen': 'Home & Kitchen',
                'beauty': 'Beauty',
                'sports': 'Sports',

                // Products
                'featured_products': 'Featured Products',
                'add_to_cart': 'Add to Cart',

                // Offers
                'special_offers': 'Special Offers',
                'free_shipping': 'Free Shipping',
                'free_shipping_desc': 'On orders over ৳1000',
                'loyalty_points': 'Loyalty Points',
                'loyalty_points_desc': 'Earn points on every purchase',
                'cashback': 'Cashback 10%',
                'cashback_desc': 'On your first order',
                'save_more': 'SAVE MORE',
                'earn_rewards': 'EARN REWARDS',
                'new_user': 'NEW USER',

                // Footer
                'nur_shopping': 'NUR Shopping',
                'about_us': 'About Us',
                'contact_us': 'Contact Us',
                'careers': 'Careers',
                'blog': 'Blog',
                'customer_service': 'Customer Service',
                'help_center': 'Help Center',
                'returns_refunds': 'Returns & Refunds',
                'shipping_info': 'Shipping Info',
                'size_guide': 'Size Guide',
                'policies': 'Policies',
                'privacy_policy': 'Privacy Policy',
                'terms_service': 'Terms of Service',
                'cookie_policy': 'Cookie Policy',
                'faq': 'FAQ',
                'contact_info': 'Contact Info',
                'phone': 'Phone: +880 1234-567890',
                'address': 'Address: 123 Shopping Street, Dhaka',
                'copyright': '&copy; 2023 NUR - Premium Shopping. All rights reserved.'
            }
        };
        this.init();
    }

    init() {
        this.setActiveLanguage();
        this.applyTranslations();
        this.setupLanguageSwitcher();
    }

    setActiveLanguage() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === this.currentLang) {
                btn.classList.add('active');
            }
        });

        // Set HTML lang attribute
        document.documentElement.lang = this.currentLang;
    }

    applyTranslations() {
        // Translate elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[this.currentLang][key]) {
                element.textContent = this.translations[this.currentLang][key];
            }
        });

        // Translate placeholder attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (this.translations[this.currentLang][key]) {
                element.placeholder = this.translations[this.currentLang][key];
            }
        });
    }

    setupLanguageSwitcher() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchLanguage(btn.dataset.lang);
            });
        });
    }

    switchLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('nur_language', lang);
        this.setActiveLanguage();
        this.applyTranslations();
        
        // Show toast notification
        if (window.nurApp) {
            window.nurApp.showToast(
                lang === 'bn' ? 'ভাষা বাংলায় পরিবর্তন করা হয়েছে' : 'Language switched to English'
            );
        }
    }

    getText(key) {
        return this.translations[this.currentLang][key] || key;
    }
}

// Initialize language support
const nurLanguage = new NURLanguage();
