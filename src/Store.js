export class Store {
  #items = [];

  constructor(initialItems = []) {
    if (Array.isArray(initialItems)) {
      this.#items = [...initialItems];
    }
  }

  add(item) {
    if (item && typeof item === 'object') {
      this.#items.push(item);
    }
  }

  remove(index) {
    if (index >= 0 && index < this.#items.length) {
      this.#items.splice(index, 1);
    }
  }

  find(predicate) {
    return this.#items.find(predicate);
  }

  get items() {
    return [...this.#items];
  }

  get total() {
    return this.#items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 0;
      return sum + (price * qty);
    }, 0);
  }

  static isValidItem(item) {
    return item && typeof item.name === 'string' && typeof item.price === 'number';
  }
}

export class SortedStore extends Store {
  constructor(initialItems = [], sortBy = 'price') {
    super(initialItems);
    this.sortBy = sortBy;
  }

  get items() {
    const baseItems = super.items;
    return baseItems.sort((a, b) => (a[this.sortBy] || 0) - (b[this.sortBy] || 0));
  }
}
