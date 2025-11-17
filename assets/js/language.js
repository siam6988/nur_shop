// Language switching functionality
class LanguageManager {
    constructor() {
        this.currentLang = 'bn';
        this.translations = {
            'bn': {
                // Header & Navigation
                'site_name': 'নুর',
                'site_tagline': 'যেখানে শপিং হয় জমজমাট!',
                'search_placeholder': 'আপনি কি খুঁজছেন?',
                'search_btn': 'খুঁজুন',
                'login_btn': 'লগইন',
                'signup_btn': 'সাইন আপ',
                'wishlist': 'উইশলিস্ট',
                'cart': 'কার্ট',
                'home': 'হোম',
                'mens_fashion': 'পুরুষদের ফ্যাশন',
                'watches': 'ঘড়ি',
                'electronics': 'ইলেকট্রনিক্স',
                'home_appliances': 'ঘরোয়া যন্ত্রপাতি',
                'about': 'আমাদের সম্পর্কে',
                'contact': 'যোগাযোগ',
                'flash_offer': 'ঝলক অফার!',
                'todays_deal': 'আজকের ডিল উপভোগ করুন',
                
                // Hero Section
                'welcome_title': 'স্বাগতম নুর ই-কমার্সে',
                'welcome_subtitle': 'আপনার পছন্দের পণ্য, আমাদের আস্থার সার্ভিস',
                'start_shopping': 'শপিং শুরু করুন',
                'our_features': 'আমাদের সুবিধা',
                'special_discount': 'চমক ডিসকাউন্ট',
                'discount_text': 'আপাত ৫০% পর্যন্ত ছাড়!',
                'today_only': 'শুধুমাত্র আজ',
                
                // Categories
                'our_categories': 'আমাদের ক্যাটেগরি',
                'mens_fashion_desc': 'ট্রেন্ডি ও স্টাইলিশ পোশাক',
                'watches_desc': 'ইলিগ্যান্ট ও ফাংশনাল',
                'electronics_desc': 'স্মার্ট ডিভাইস ও গ্যাজেট',
                'home_appliances_desc': 'আধুনিক জীবনযাপন',
                'browse': 'ব্রাউজ করুন',
                
                // Products
                'power_deals': 'পাওয়ার ডিল',
                'view_all': 'সব দেখুন',
                'hot': 'হট',
                'new': 'নতুন',
                'sale': 'সেল',
                'add_to_cart': 'কার্টে যোগ',
                
                // Special Offer
                'special_discount_today': 'শুধুমাত্র আজকের জন্য বিশেষ ডিসকাউন্ট',
                'buy_now': 'এখনই কিনুন',
                
                // Footer
                'footer_description': 'আপনার বিশ্বস্ত শপিং পার্টনার। আমরা সর্বোচ্চ মানের প্রোডাক্ট এবং সার্ভিস নিশ্চিত করি।',
                'facebook': 'ফেসবুক',
                'instagram': 'ইনস্টাগ্রাম',
                'quick_links': 'দ্রুত লিংক',
                'shop': 'শপ',
                'customer_service': 'গ্রাহক সেবা',
                'privacy_policy': 'প্রাইভেসি পলিসি',
                'return_policy': 'রিটার্ন পলিসি',
                'shipping_info': 'শিপিং তথ্য',
                'contact_info': 'যোগাযোগ তথ্য',
                'address': 'হকার্স মার্কেট, বন্দর বাজার, সিলেট',
                'working_hours': 'শনি-বৃহস্পতি: সকাল ৯টা - রাত ১১টা',
                'all_rights_reserved': 'সমস্ত অধিকার সংরক্ষিত।'
            },
            'en': {
                // Header & Navigation
                'site_name': 'Nur',
                'site_tagline': 'Where Shopping Gets Exciting!',
                'search_placeholder': 'What are you looking for?',
                'search_btn': 'Search',
                'login_btn': 'Login',
                'signup_btn': 'Sign Up',
                'wishlist': 'Wishlist',
                'cart': 'Cart',
                'home': 'Home',
                'mens_fashion': "Men's Fashion",
                'watches': 'Watches',
                'electronics': 'Electronics',
                'home_appliances': 'Home Appliances',
                'about': 'About Us',
                'contact': 'Contact',
                'flash_offer': 'Flash Offer!',
                'todays_deal': 'Enjoy Today\'s Deal',
                
                // Hero Section
                'welcome_title': 'Welcome to Nur E-Commerce',
                'welcome_subtitle': 'Your Preferred Products, Our Trusted Service',
                'start_shopping': 'Start Shopping',
                'our_features': 'Our Features',
                'special_discount': 'Special Discount',
                'discount_text': 'Up to 50% OFF!',
                'today_only': 'Today Only',
                
                // Categories
                'our_categories': 'Our Categories',
                'mens_fashion_desc': 'Trendy & Stylish Clothing',
                'watches_desc': 'Elegant & Functional',
                'electronics_desc': 'Smart Devices & Gadgets',
                'home_appliances_desc': 'Modern Lifestyle',
                'browse': 'Browse',
                
                // Products
                'power_deals': 'Power Deals',
                'view_all': 'View All',
                'hot': 'Hot',
                'new': 'New',
                'sale': 'Sale',
                'add_to_cart': 'Add to Cart',
                
                // Special Offer
                'special_discount_today': 'Special discount for today only',
                'buy_now': 'Buy Now',
                
                // Footer
                'footer_description': 'Your trusted shopping partner. We ensure highest quality products and services.',
                'facebook': 'Facebook',
                'instagram': 'Instagram',
                'quick_links': 'Quick Links',
                'shop': 'Shop',
                'customer_service': 'Customer Service',
                'privacy_policy': 'Privacy Policy',
                'return_policy': 'Return Policy',
                'shipping_info': 'Shipping Info',
                'contact_info': 'Contact Info',
                'address': 'Hokars Market, Bondor Bazar, Sylhet',
                'working_hours': 'Sat-Thu: 9 AM - 11 PM',
                'all_rights_reserved': 'All rights reserved.'
            }
        };
        
        this.init();
    }
    
    init() {
        this.loadLanguage();
        this.setupEventListeners();
    }
    
    loadLanguage() {
        const savedLang = localStorage.getItem('nur_language') || 'bn';
        this.switchLanguage(savedLang);
    }
    
    setupEventListeners() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.switchLanguage(lang);
            });
        });
    }
    
    switchLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('nur_language', lang);
        
        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Update all translatable elements
        this.updateContent();
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }
    
    updateContent() {
        const translation = this.translations[this.currentLang];
        
        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translation[key]) {
                element.textContent = translation[key];
            }
        });
        
        // Update placeholder attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translation[key]) {
                element.placeholder = translation[key];
            }
        });
    }
}

// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LanguageManager();
});
