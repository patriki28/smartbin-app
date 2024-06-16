import { sortDate } from './sortDate';

export const filterBinLevel = (data) => {
    let sortedData = sortDate(data);
    const latestFillLevels = {};
    for (const level of sortedData) {
        const binId = `${level.bin}-${level.bin_type}`;
        if (!latestFillLevels[binId]) {
            latestFillLevels[binId] = level;
        }
    }
    const latestFillLevelsArray = Object.values(latestFillLevels);

    return latestFillLevelsArray;
};
