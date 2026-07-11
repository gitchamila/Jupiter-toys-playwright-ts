export function parseCurrency(currencyText: string): number {
    return Number(currencyText
        .replace('$', '')
        .replace('Total:', '')
        .trim()
    );
}

export function calculateSubtotal(price: number, quantity: number): number {
    return Number((price * quantity).toFixed(2));
}

export function calculateTotal(subtotals: number[]): number {
    let total = 0;
    for (const subtotal of subtotals) {
        total += subtotal;
    }
    return Number(total.toFixed(2));
}