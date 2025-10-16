// This file centralizes all static asset paths for the application.
// By keeping them here, we can easily update images and other assets
// without changing component code.

// Use Vite's base so URLs work whether hosted at root or a subpath.
// Note: files in the `assets/` folder (publicDir) are copied to the dist root.
const BASE = import.meta.env.BASE_URL || '/';
export const LOGO_URL = `${BASE}logo/hide-haven-logo.jpg`;
export const COVER_URL = `${BASE}logo/contact-page-cover.jpg`;

export const PRODUCT_IMAGES: { [key: number]: string } = {
    1: `${BASE}products/new-arrival-brown-belt.jpg`,
    2: `${BASE}products/premium-black-belt.jpg`,
    3: `${BASE}products/new-premium-leather-belt.jpg`,
    4: `${BASE}products/new-premium-brown-leather-belt.jpg`,
    5: `${BASE}products/premium-stylish-wallets.jpg`,
    6: `${BASE}products/spacious-bifold-wallet.jpg`,
    8: `${BASE}products/dark-embossed-pattern-wallet.jpg`,
    9: `${BASE}products/dark-embossed-pattern-wallet-1.jpg`,
    10: `${BASE}products/mens-premium-black-belt.jpg`,
    11: `${BASE}products/mens-premium-brown-belt.jpg`,
    12: `${BASE}products/mens-premium-stitched-belt.jpg`,
    16: `${BASE}products/new-premium-formal-reversible-chocolate-belt.jpg`,
    17: `${BASE}products/new-premium-gridlock-reversible-chocolate-belt.jpg`,
    18: `${BASE}products/new-premium-formal-reversible-black-mustard-belt.jpg`,
    19: `${BASE}products/new-premium-basketweave-reversible-chocolate-belt.jpg`,
    20: `${BASE}products/new-premium-stitched-chocolate-belt.jpg`,
    21: `${BASE}products/new-premium-basketweave-reversible-black-belt.jpg`,
    22: `${BASE}products/new-premium-gridlock-reversible-black-belt.jpg`,
    23: `${BASE}products/auto-gear-belt-black.jpg`,
    24: `${BASE}products/embossed-stitched-moving-belt-black.jpg`,
    25: `${BASE}products/embossed-stitched-moving-belt-chocolate.jpg`,
    26: `${BASE}products/woven-pattern-moving-belt-black.jpg`,
    27: `${BASE}products/woven-pattern-moving-belt-chocolate.jpg`,
    28: `${BASE}products/premium-crosshatched-long-wallet.jpg`,
    29: `${BASE}products/premium-crosshatched-long-wallet-2.jpg`,
    30: `${BASE}products/premium-crosshatched-long-wallet-3.mp4`,
    31: `${BASE}products/premium-black-embossed-belt.jpg`,
    32: `${BASE}products/auto-gear-belt-black-1.jpg`,
    33: `${BASE}products/auto-gear-belt-black-2.jpg`,
    34: `${BASE}products/new-premium-formal-reversible-chocolate-belt-1.jpg`,
    35: `${BASE}products/new-premium-formal-reversible-chocolate-belt-2.jpg`,
    36: `${BASE}products/17-1.jpg`,
    37: `${BASE}products/17-2.jpg`,
    38: `${BASE}products/mens-premium-stitched-belt-1.jpg`,
    39: `${BASE}products/mens-premium-stitched-belt-2.jpg`,
    40: `${BASE}products/dot-moving-belt-1.jpg`,
    41: `${BASE}products/dot-moving-belt-2.jpg`,
    42: `${BASE}products/embossed-stitched-moving-belt-chocolate-1.jpg`,
    43: `${BASE}products/embossed-stitched-moving-belt-black-1.jpg`,
    44: `${BASE}products/woven-pattern-moving-belt-black-1.jpg`,
    45: `${BASE}products/woven-pattern-moving-belt-chocolate-1.jpg`,
    46: `${BASE}products/19-1.jpg`,
    47: `${BASE}products/19-2.jpg`,
};
