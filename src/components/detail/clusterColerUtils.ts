// TODO Cluster color 1 looks a lot like Brand color... Which should be changed?

export function getClusterColor(cluster: number | null | undefined) {
    if (
        cluster === null ||
        cluster === undefined ||
        cluster < 0 ||
        cluster > 4
    ) {
        return undefined;
    }

    const colors = ["#1f77b4", "#17becf", "#bcbd22", "#d62728"];

    return colors[cluster - 1];
}
