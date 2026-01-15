/**
 * Shared utility functions
 */

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} - Escaped HTML
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Check if user has any of the specified roles
 * @param {Object} profile - User profile object
 * @param {Array<string>} roles - Array of role names to check
 * @returns {boolean} - True if user has any of the roles
 */
export function hasAnyRole(profile, roles) {
  const userRoles = [...(profile.roles || []), ...(profile.extraRoles || [])];
  return roles.some(role => userRoles.includes(role));
}

/**
 * Get human-readable label for a role
 * @param {string} role - Role identifier
 * @returns {string} - Human-readable role label
 */
export function getRoleLabel(role) {
  const labels = {
    'super_admin': 'Super Admin',
    'ketua': 'Ketua',
    'wakil_ketua': 'Wakil Ketua',
    'sekretaris': 'Sekretaris',
    'bendahara': 'Bendahara',
    'koordinator_sie': 'Koordinator Sie',
    'anggota': 'Anggota'
  };
  return labels[role] || role;
}

/**
 * Format number as Indonesian Rupiah currency
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}
