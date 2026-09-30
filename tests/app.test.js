import { describe, it, expect } from 'vitest';
import { unique, groupBy, chunk, deepClone, memoize, counter } from '../src/functions.js';
import { Store, SortedStore } from '../src/Store.js';

describe('Functions Tests (Part 1)', () => {
  it('1. unique should remove duplicates and handle empty array', () => {
    expect(unique([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
    expect(unique([])).toEqual([]);
    expect(unique('not array')).toEqual([]);
  });

  it('2. groupBy should group items correctly', () => {
    const data = [{age: 20, name: 'A'}, {age: 20, name: 'B'}, {age: 25, name: 'C'}];
    const grouped = groupBy(data, x => x.age);
    expect(grouped[20].length).toBe(2);
    expect(groupBy(null, x => x)).toEqual({});
  });

  it('3. chunk should split array into pieces with edge cases', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk([], 3)).toEqual([]);
    expect(chunk([1, 2], 0)).toEqual([]);
  });

  it('4. deepClone should copy objects, arrays and Dates', () => {
    const date = new Date('2026-01-01');
    const obj = { a: 1, b: [2, 3], c: date };
    const clone = deepClone(obj);
    expect(clone).toEqual(obj);
    expect(clone.c).not.toBe(date);
    expect(deepClone(null)).toBeNull();
  });

  it('5. memoize should cache results using closure', () => {
    let calls = 0;
    const slowFn = (x) => { calls++; return x * 2; };
    const memoized = memoize(slowFn);
    
    expect(memoized(5)).toBe(10);
    expect(memoized(5)).toBe(10);
    expect(calls).toBe(1);
    expect(memoize('not function')).toBe('not function');
  });

  it('6. counter factory should work via closure', () => {
    const c = counter(5);
    expect(c.value()).toBe(5);
    expect(c.inc()).toBe(6);
    expect(c.inc()).toBe(7);
    expect(c.dec()).toBe(6);
  });
});

describe('Store & SortedStore Tests (Part 2)', () => {
  it('7. Store should add and remove items correctly', () => {
    const store = new Store();
    store.add({ name: 'Apple', price: 100, qty: 2 });
    expect(store.items.length).toBe(1);
    store.remove(0);
    expect(store.items.length).toBe(0);
  });

  it('8. Store total calculation should handle numbers and edge cases', () => {
    const store = new Store([
      { name: 'A', price: 50, qty: 3 },
      { name: 'B', price: 200, qty: 0 }
    ]);
    expect(store.total).toBe(150);
  });

  it('9. Store find method should locate item', () => {
    const store = new Store([{ name: 'Pen', price: 10, qty: 5 }]);
    const found = store.find(i => i.name === 'Pen');
    expect(found.price).toBe(10);
  });

  it('10. Store static method isValidItem should work', () => {
    expect(Store.isValidItem({ name: 'Book', price: 500 })).toBe(true);
    expect(Store.isValidItem({ name: 'Book' })).toBe(false);
  });

  it('11. SortedStore should inherit and sort items using super', () => {
    const sortedStore = new SortedStore([
      { name: 'Expensive', price: 1000, qty: 1 },
      { name: 'Cheap', price: 100, qty: 1 }
    ], 'price');
    
    expect(sortedStore.items[0].name).toBe('Cheap');
  });

  it('12. Store should safely handle invalid initial items or removal', () => {
    const store = new Store('not an array');
    expect(store.items).toEqual([]);
    store.remove(99);
    expect(store.items).toEqual([]);
  });
});
