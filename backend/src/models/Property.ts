export class Property {
  name: string;
  curState: string;

  constructor(name: string, curState: string) {
    this.name = name;
    this.curState = curState;
  }

  getName(): string {
    return this.name;
  }

  updateName(name: string) {
    this.name = name;
  }

  getCurState(): string {
    return this.curState;
  }

  updateCurState(curState: string) {
    this.curState = curState;
  }
}
