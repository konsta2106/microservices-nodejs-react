import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

// Scrypt is callback based. Use promisify to turn it into promise based approach
const scrtyptAsync = promisify(scrypt);

export class Password {
  // Static can be called directly Password.hash without creating instance of the class new Password()
  static async hash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scrtyptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scrtyptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}
