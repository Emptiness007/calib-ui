export class WorkerStore {
  constructor(fio: string, post: string, phone: string, email: string) {
    this.fio = fio;
    this.post = post;
    this.phone = phone;
    this.email = email;
  }
  fio: string;
  post: string;
  phone: string;
  email: string;
}
