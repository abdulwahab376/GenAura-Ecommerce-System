const KEY = "userBehavior";

export const trackClick = (category) => {
  if (!category) return;
  const data = JSON.parse(localStorage.getItem(KEY) || "{}");
  data[category] = (data[category] || 0) + 1;
  localStorage.setItem(KEY, JSON.stringify(data));
};

export const getTopCategories = (limit = 3) => {
  const data = JSON.parse(localStorage.getItem(KEY) || "{}");
  return Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([cat]) => cat);
};

export const clearBehavior = () => {
  localStorage.removeItem(KEY);
};






