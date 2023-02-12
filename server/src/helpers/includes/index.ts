export const includes = (array: any[], target: any) => {
  return array.some(element => isEqual(element, target));
};

const isEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);
