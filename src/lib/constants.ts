export const CAKE_CATEGORIES = [
  "Birthday Cakes",
  "Wedding Cakes",
  "Bento Cakes",
  "Custom Cakes",
];

export const CAKE_SIZES = [
  { size: "1kg", price: 3500 },
  { size: "1.5kg", price: 5000 },
  { size: "2kg", price: 6500 },
];

export const CAKE_FLAVORS = [
  "Classic Butter Cake",
  "Rich Chocolate",
  "Ribbon Cake",
  "Coffee Cake",
  "Red Velvet",
];

export const ORDER_STATUSES = [
  "Pending",
  "Accepted",
  "Baking",
  "Ready",
  "Delivered",
] as const;

export const PAYMENT_STATUSES = ["Pending", "Paid"] as const;
