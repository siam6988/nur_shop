// The central state of our application
const state = {
    currentUser: null,
    products: [],
    cart: JSON.parse(localStorage.getItem('nurCart')) || [],
    currentProduct: null,
};

// Functions to update the state
export function setUser(user) {
    state.currentUser = user;
    console.log('Current user set in store:', state.currentUser?.email);
}
// ... (বাকি কোড অপরিবর্তিত) ...
export default state;
