export function getClusterColor(cluster: number) {
    const colors = ["#1f77b4", "#17becf", "#bcbd22", "#d62728"];

    return colors[cluster - 1];
}
