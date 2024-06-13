export class User {
  private userName: string;
  private userPasswordHash: string;

  constructor(userName: string, userPasswordHash: string) {
    this.userName = userName;
    // TODO: Hash passwords <2024-06-11>
    this.userPasswordHash = userPasswordHash;
  }

  getUserName(): string {
    return this.userName;
  }

  getPassword(): string {
    return this.userPasswordHash;
  }
}
