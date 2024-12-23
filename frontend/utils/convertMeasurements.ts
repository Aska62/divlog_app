export function convertCmToInch (val: number): number {
  console.log('convertCmToInches');
  return roundTwoDecimals(val * 0.393701);
}

export function convertInchToCm (val: number): number {
  console.log('convertInchesToCms');
  return roundTwoDecimals(val / 0.393701);
}

export function convertKgToIb (val: number): number {
  console.log('convertKgToIb');
  return roundTwoDecimals(val * 2.20462);
}

export function convertIbToKg (val: number): number {
  console.log('convertIbToKg');
  return roundTwoDecimals(val / 2.20462);
}

function roundTwoDecimals (val: number) :number {
  return Math.round(val * 10 ** 2) / 10 ** 2;
}