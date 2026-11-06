/**
 * Host half of the plugin-market-entry bundle.
 *
 * The experience lives entirely in the Client half: a sidebar entry plus the
 * main panel it selects. The market content itself comes from the live Client
 * service `market` (plugin market bundle); when that service is absent the
 * panel falls back to a localized landing card. No Host state is needed, so
 * this module only participates in the bundle patch.
 */
export function apply() {}
