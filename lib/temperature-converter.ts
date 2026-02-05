export function celsiusToFahrenheit(celsius: number): number {
    return (celsius * 9 / 5) + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
    return (fahrenheit - 32) * 5 / 9;
}

export function convertTemperature(temp: number, targetUnit: 'C' | 'F', currentUnit: 'C' | 'F' = 'C'): number {
    if (currentUnit === targetUnit) return temp;

    if (targetUnit === 'F') {
        return celsiusToFahrenheit(temp);
    } else {
        return fahrenheitToCelsius(temp);
    }
}

export function convertTemperatureString(tempString: string, targetUnit: 'C' | 'F'): string {
    const matches = tempString.match(/(-?\d+)/g);
    if (!matches) return tempString;

    const convertedTemps = matches.map(temp => {
        const numTemp = parseInt(temp);
        return targetUnit === 'F' ? Math.round(celsiusToFahrenheit(numTemp)) : numTemp;
    });

    return `${convertedTemps[0]}~${convertedTemps[1]}°`;
}
