export const swap = (list: any[], a: number, b: number) => {
  const temp = list[a];
  list[a] = list[b];
  list[b] = temp;
};
