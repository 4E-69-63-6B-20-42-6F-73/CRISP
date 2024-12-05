class MinMaxScaler {
    private min: number;
    private max: number;

    constructor() {
        this.min = 0;
        this.max = 1;
    }

    fit(data: number[]): void {
        this.min = Math.min(...data);
        this.max = Math.max(...data);
    }

    transform(data: number[]): number[] {
        const range = this.max - this.min;
        if (range === 0) {
            // All values are the same, return an array of zeros
            return data.map(() => 0);
        }
        return data.map((value) => {
            return (value - this.min) / range;
        });
    }

    fitTransform(data: number[]): number[] {
        this.fit(data);
        return this.transform(data);
    }

    inverseTransform(scaledData: number[]): number[] {
        const range = this.max - this.min;
        if (range === 0) {
            return scaledData.map(() => this.min);
        }
        return scaledData.map((value) => {
            return value * range + this.min;
        });
    }
}

export default MinMaxScaler;
