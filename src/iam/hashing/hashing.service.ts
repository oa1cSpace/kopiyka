import { Injectable } from '@nestjs/common';

@Injectable()
// to let class act as interface make it abstract
export abstract class HashingService {
  abstract hash(data: string | Buffer): Promise<string>;
  abstract compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}
