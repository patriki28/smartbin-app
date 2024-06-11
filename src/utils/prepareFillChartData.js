import formatTimePeriodLabel from './formatTimePeriodLabel';

export const prepareFillChartData = (data, filterBy, values, valueKey, timePeriod, selectedValue) => {
    const labels = [...new Set(data.map((item) => formatTimePeriodLabel(new Date(item.time_stamp), timePeriod)))];

    const datasets = values.map((value, index) => {
        const valueData = data.filter((item) => item[filterBy] === value);
        const valueValues = labels.map((label) => {
            const items = valueData.filter((d) => formatTimePeriodLabel(new Date(d.time_stamp), timePeriod) === label);
            return valueKey ? (items.length > 0 ? items[0][valueKey] : 0) : items.length;
        });

        const hue = index * (360 / values.length);
        return {
            label: value,
            data: valueValues,
            color: (opacity = 1) => `hsla(${hue}, 70%, 50%, ${opacity})`,
        };
    });

    const filteredDatasets = selectedValue === 'All' ? datasets : datasets.filter((dataset) => dataset.label === selectedValue);

    return { labels, datasets: filteredDatasets };
};
