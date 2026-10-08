export interface SupportContact {
  raw: string;
  display: string;
  international: string;
  tel: string;
  whatsapp: string;
}

export const SUPPORT_NUMBERS: SupportContact[] = [
  {
    raw: "8879514626",
    display: "88795 14626",
    international: "+91 88795 14626",
    tel: "tel:8879514626",
    whatsapp:
      "https://wa.me/918879514626?text=Hello%20GullyGig%20Support!%20I%20need%20assistance.",
  },
  {
    raw: "7559302315",
    display: "755 930 2315",
    international: "+91 755 930 2315",
    tel: "tel:7559302315",
    whatsapp:
      "https://wa.me/917559302315?text=Hello%20GullyGig%20Support!%20I%20need%20assistance.",
  },
  {
    raw: "8263081521",
    display: "82630 81521",
    international: "+91 82630 81521",
    tel: "tel:8263081521",
    whatsapp:
      "https://wa.me/918263081521?text=Hello%20GullyGig%20Support!%20I%20need%20assistance.",
  },
];

export const SUPPORT_EMAIL = "support@gullygig.in";

export const SUPPORT_NUMBERS_STRING = "88795 14626 / 755 930 2315 / 82630 81521";
