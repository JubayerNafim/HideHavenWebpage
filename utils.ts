import { API_ENDPOINT } from './constants';

/**
 * Check if the backend API is reachable and functioning
 * @returns Promise<{success: boolean, message: string}>
 */
export async function checkBackendConnectivity(): Promise<{success: boolean, message: string}> {
  try {
    const response = await fetch(`${API_ENDPOINT}?action=ping`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (response.ok) {
      try {
        const data = await response.json();
        return { 
          success: true, 
          message: data.message || 'Backend connection successful' 
        };
      } catch {
        return { 
          success: true, 
          message: 'Backend connection successful, but response format unexpected' 
        };
      }
    } else {
      return { 
        success: false, 
        message: `Backend connectivity issue (Status: ${response.status})` 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      message: `Backend connectivity failed: ${error.message || 'Unknown error'}` 
    };
  }
}

/**
 * Get the current cart count from cart items
 * @param cart Cart items array
 * @returns Total quantity of items in cart
 */
export function getCartCount(cart: Array<{quantity: number}>): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}