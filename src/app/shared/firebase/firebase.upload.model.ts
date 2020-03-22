export class FirebaseUpload {
  key: string;
  file: File;
  name: string;
  url: string;
  progress: number;
  createAt: Date = new Date();

  constructor(file: File) {
    this.file = file;
  }
}

