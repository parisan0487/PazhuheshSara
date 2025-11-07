// lib/dateHelpers.js
import moment from "moment-jalaali";

/** Normalize Persian digits to ascii digits and remove extra chars */
export function toEnglishDigits(str = "") {
    if (!str) return "";
    return str
        .toString()
        .replace(/[\u06F0-\u06F9]/g, d => String.fromCharCode(d.charCodeAt(0) - 1728))
        .replace(/[\u0660-\u0669]/g, d => String.fromCharCode(d.charCodeAt(0) - 1584))
        .replace(/[^\d\/\-]/g, "");
}

/** Given jDate like "1404/08/19" returns JS Date in Asia/Tehran (start of day) */
export function jalaaliToGDateStartOfDay(jDateStr) {
    const normalized = toEnglishDigits(jDateStr);
    // moment-jalaali: parse as jalaali then convert to ISO; ensure plugin loaded where used
    const m = moment(normalized, "jYYYY/jMM/jDD", true);
    if (!m.isValid()) return null;
    return m.tz ? m.tz("Asia/Tehran").startOf("day").toDate() : m.startOf("day").toDate();
}
