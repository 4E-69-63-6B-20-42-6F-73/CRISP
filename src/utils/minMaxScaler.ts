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
        return data.map((value) => {
            return (value - this.min) / (this.max - this.min);
        });
    }

    fitTransform(data: number[]): number[] {
        this.fit(data);
        return this.transform(data);
    }

    inverseTransform(scaledData: number[]): number[] {
        return scaledData.map((value) => {
            return value * (this.max - this.min) + this.min;
        });
    }
}

export default MinMaxScaler;
