/**
 * Etosmania Global Properties Investment Limited — WhatsApp & Direct Call Utility
 *
 * Official Contact Lines from Corporate Charter:
 * - Primary WhatsApp & Call: 09138453949 (+234 913 845 3949)
 * - Secondary Direct Call: 09047325666 (+234 904 732 5666)
 * - Email: etosmaniaproperties@gmail.com
 * - Headquarters: 10B Thomas Estate, Ajah, Lekki, Lagos State
 */
export const WHATSAPP_PHONE_NUMBER = '2349138453949';
export const SECONDARY_PHONE_NUMBER = '2349047325666';
export const DISPLAY_PRIMARY_PHONE = '0913 845 3949';
export const DISPLAY_SECONDARY_PHONE = '0904 732 5666';

/**
 * Pre-filled message for general enquiries or floating button.
 */
export function getGeneralWhatsAppMessage(): string {
  return 'Hello Etosmania Global Properties, I am interested in your Real Estate Gold portfolio (Land, Houses, Co-ownership & Investment) across Ajah, Lekki, Egbeda, Akowonjo & Agbara and would like to speak with an advisor.';
}

/**
 * Builds a standard wa.me URL with clean URI-encoded text.
 */
export function getWhatsAppUrl(
  message: string = getGeneralWhatsAppMessage(),
  phoneNumber: string = WHATSAPP_PHONE_NUMBER
): string {
  const sanitizedPhone = phoneNumber.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${sanitizedPhone}?text=${encodedText}`;
}

/**
 * Pre-filled message for a specific property listing.
 */
export function getPropertyWhatsAppMessage(property: {
  title: string;
  location: string;
  id: string;
  ref?: string;
}): string {
  const reference = property.ref || property.id;
  return `Hello Etosmania Global Properties, I'm interested in ${property.title} at ${property.location} (Ref: ${reference}). Is it still available?`;
}

export function getPropertyWhatsAppUrl(property: {
  id: string;
  title: string;
  location: string;
  priceFormatted?: string;
}): string {
  return getWhatsAppUrl(getPropertyWhatsAppMessage(property));
}

/**
 * Pre-filled message for scheduling a property inspection.
 */
export function getInspectionWhatsAppMessage(params: {
  propertyTitle: string;
  location?: string;
  ref?: string;
  preferredDate?: string;
  preferredTime?: string;
  clientName?: string;
  inspectionType?: string;
}): string {
  const locPart = params.location ? ` at ${params.location}` : '';
  const refPart = params.ref ? ` (Ref: ${params.ref})` : '';
  let msg = `Hello Etosmania Global Properties, I would like to book an inspection for ${params.propertyTitle}${locPart}${refPart}.`;
  if (params.preferredDate) {
    msg += ` Preferred date: ${params.preferredDate}`;
    if (params.preferredTime) {
      msg += ` around ${params.preferredTime}`;
    }
    msg += '.';
  }
  if (params.inspectionType) {
    msg += ` Format: ${params.inspectionType}.`;
  }
  if (params.clientName) {
    msg += ` My name is ${params.clientName}.`;
  }
  return msg;
}

export function getInspectionWhatsAppUrl(params: {
  clientName: string;
  propertyTitle: string;
  preferredDate: string;
  inspectionType: string;
}): string {
  return getWhatsAppUrl(getInspectionWhatsAppMessage(params));
}

/**
 * Pre-filled message for an off-plan or estate development project.
 */
export function getDevelopmentWhatsAppMessage(development: {
  name: string;
  location: string;
  id: string;
  unitType?: string;
}): string {
  if (development.unitType) {
    return `Hello Etosmania Global Properties, I'm enquiring about the ${development.unitType} at ${development.name} in ${development.location} (Ref: ${development.id}). Please share available inventory and payment schedules.`;
  }
  return `Hello Etosmania Global Properties, I would like to enquire about availability and payment milestones for ${development.name} in ${development.location} (Ref: ${development.id}).`;
}

/**
 * Pre-filled message for a specific service category.
 */
export function getServiceWhatsAppMessage(serviceTitle: string): string {
  return `Hello Etosmania Global Properties, I would like to consult your advisory team at 10B Thomas Estate, Ajah regarding your "${serviceTitle}" service.`;
}

/**
 * Pre-filled message for Real Estate Co-Ownership slot reservations & calculations.
 */
export function getCoOwnershipWhatsAppMessage(params: {
  projectTitle: string;
  slots: number;
  totalInvestment: string;
  projectedAnnualReturn?: string;
}): string {
  return `Hello Etosmania Global Properties, I would like to reserve ${params.slots} co-ownership ${params.slots === 1 ? 'slot' : 'slots'} (${params.totalInvestment}) in "${params.projectTitle}".${params.projectedAnnualReturn ? ` Projected annual dividend: ${params.projectedAnnualReturn}.` : ''} Please share the Co-Ownership Deed and subscription steps.`;
}

export function getCoOwnershipWhatsAppUrl(params: {
  title: string;
  slots: number;
  pricePerSlot: string;
}): string {
  return getWhatsAppUrl(
    getCoOwnershipWhatsAppMessage({
      projectTitle: params.title,
      slots: params.slots,
      totalInvestment: `${params.slots} x ${params.pricePerSlot}`,
    })
  );
}
