// data.js - Temporary Database

export const banners = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "নূরের নতুন কালেকশন",
    subtitle: "এই ঈদে আপনার স্টাইলকে দিন নতুন মাত্রা"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "৫০% পর্যন্ত বিশাল ছাড়!",
    subtitle: "নির্বাচিত পোশাকে উপভোগ করুন বিশেষ মূল্যছাড়"
  },
];

export const products = [
  {
    id: 1,
    name: "পুরুষদের প্রিমিয়াম কটন পাঞ্জাবি",
    price: 2500,
    discount: 15, // শতাংশ (percentage)
    freeShipping: false,
    category: "men",
    rating: 4.8,
    reviews: 25,
    image: "https://images.unsplash.com/photo-1622288390742-a059800a7755?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "আরামদায়ক প্রিমিয়াম কটন ফেব্রিকে তৈরি যা আপনাকে দেবে অভিজাত লুক। যেকোনো উৎসব বা অনুষ্ঠানের জন্য মানানসই।"
  },
  {
    id: 2,
    name: "নারীদের এমব্রয়ডারি জর্জেট শাড়ি",
    price: 3500,
    discount: 0,
    freeShipping: true,
    category: "women",
    rating: 4.9,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1610189335839-a54b3834a364?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "সফট জর্জেটের উপর নিখুঁত এমব্রয়ডারির কাজ করা এই শাড়িটি পার্টি বা অনুষ্ঠানে আপনাকে করে তুলবে অনন্যা। সাথে থাকছে ফ্রি শিপিং!"
  },
  {
    id: 3,
    name: "স্টাইলিশ লেদার জ্যাকেট",
    price: 4200,
    discount: 10,
    freeShipping: false,
    category: "men",
    rating: 4.7,
    reviews: 18,
    image: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "১০০% আসল লেদারে তৈরি এই জ্যাকেটটি শীতের সেরা সঙ্গী। আধুনিক ডিজাইন এবং আরামদায়ক ফিটিং।"
  },
  {
    id: 4,
    name: "মেয়েদের ফ্লোরাল প্রিন্ট পার্টি ড্রেস",
    price: 2800,
    discount: 0,
    freeShipping: true,
    category: "women",
    rating: 4.9,
    reviews: 35,
    image: "https://images.unsplash.com/photo-1574655221919-8ae63253b276?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "যেকোনো পার্টির জন্য উপযুক্ত এই সুন্দর ফ্লোরাল প্রিন্টের ড্রেস। আরামদায়ক ফেব্রিক এবং দারুণ ডিজাইন।"
  },
  {
    id: 5,
    name: "ছেলেদের প্রিমিয়াম জিন্স প্যান্ট",
    price: 1800,
    discount: 5,
    freeShipping: false,
    category: "men",
    rating: 4.6,
    reviews: 50,
    image: "https://images.unsplash.com/photo-1602293589914-9FF0554d6714?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "স্ট্রেচেবল ডেনিম ফেব্রিকে তৈরি, খুবই আরামদায়ক এবং স্টাইলিশ।"
  },
  {
    id: 6,
    name: "ওয়েস্টার্ন টপস ফর উইমেন",
    price: 1250,
    discount: 0,
    freeShipping: true,
    category: "women",
    rating: 4.5,
    reviews: 29,
    image: "https://images.unsplash.com/photo-1594615962773-636b8a8b1a37?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "ক্যাজুয়াল ওয়্যার হিসেবে দারুণ একটি টপস। জিন্স বা লেগিংসের সাথে পরা যাবে।"
  }
];
