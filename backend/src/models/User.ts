export class User {
  private userName: string;
  private userPasswordHash: string;

  constructor(userName: string, userPasswordHash: string) {
    this.userName = userName;
    this.userPasswordHash = userPasswordHash;
  }

  getUserName(): string {
    return this.userName;
  }

  getPassword(): string {
    return this.userPasswordHash;
  }
}
