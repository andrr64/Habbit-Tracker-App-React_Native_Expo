export const formatTanggal = (date) => {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
};


export const ambilTanggal = (date) => {
    return date.toISOString().split('T')[0];
}