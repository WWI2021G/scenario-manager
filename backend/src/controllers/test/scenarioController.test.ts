function sumNew(a: number, b: number): number {
  return a + b;
}

test('adds 1 + 2 to equal 3', () => {
  expect(sumNew(1, 2)).toBe(3);
});


