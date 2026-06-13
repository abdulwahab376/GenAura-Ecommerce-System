// const KEY = "userBehavior";

// export const trackClick = (category) => {
//   if (!category) return;
//   const data = JSON.parse(localStorage.getItem(KEY) || "{}");
//   data[category] = (data[category] || 0) + 1;
//   localStorage.setItem(KEY, JSON.stringify(data));
// };

// export const getTopCategories = (limit = 3) => {
//   const data = JSON.parse(localStorage.getItem(KEY) || "{}");
//   return Object.entries(data)
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, limit)
//     .map(([cat]) => cat);
// };

// export const clearBehavior = () => {
//   localStorage.removeItem(KEY);
// };






// ==========================================
// 🎯 TRACKBEHAVIOR.JS (Updated Version)
// ==========================================

// 1. Click ko track karne ka function
export const trackClick = (category) => {
    if (!category) return;
    
    const cleanCategory = category.toLowerCase().trim();
    
    // Local storage se purani history uthayein
    let history = JSON.parse(localStorage.getItem("user_behavior")) || {};
    
    // Aggressive Boost: Naye click par seedha +5 score dein taake wo foran top par aaye
    if (!history[cleanCategory]) {
        history[cleanCategory] = 5; 
    } else {
        history[cleanCategory] += 5;
    }
    
    // Timestamp save karein taake latest item hamesha unchi priority paye
    let timestamps = JSON.parse(localStorage.getItem("behavior_timestamps")) || {};
    timestamps[cleanCategory] = Date.now();
    
    localStorage.setItem("user_behavior", JSON.stringify(history));
    localStorage.setItem("behavior_timestamps", JSON.stringify(timestamps));
    
    console.log(`📈 Behavior Tracked for: ${cleanCategory} | New Score:`, history[cleanCategory]);
};

// 2. Top categories nikalne ka function (AI ke liye)
export const getTopCategories = (limit = 3) => {
    const history = JSON.parse(localStorage.getItem("user_behavior")) || {};
    const timestamps = JSON.parse(localStorage.getItem("behavior_timestamps")) || {};
    
    const categories = Object.keys(history);
    
    if (categories.length === 0) return [];
    
    // Sort logic: Score aur Recency (Time) dono ko mila kar sort karein
    return categories
        .sort((a, b) => {
            // Agar dono ka score barabar ho ya latest item ko upar lana ho
            const timeA = timestamps[a] || 0;
            const timeB = timestamps[b] || 0;
            
            // Jis ka timestamp naya hai ya score zyada hai wo pehle aayega
            return (history[b] + timeB / 1000000000) - (history[a] + timeA / 1000000000);
        })
        .slice(0, limit);
};