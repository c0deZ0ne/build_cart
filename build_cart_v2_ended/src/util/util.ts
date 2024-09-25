import * as crypto from 'crypto';
import { ProductDTO } from 'src/modules/vendor/dto/addProductsToVendor';
import * as _ from 'lodash';
import * as moment from 'moment';

export function randomNumberGenerator(size: number) {
  if (size > 15) {
    throw new Error('Random number generator can only generate 15 digits');
  }

  const min = 10 ** (size - 1);
  const max = +'9'.repeat(size);
  return crypto.randomInt(min, max);
}

export function calculatePercentageChange(trendPerMonth: number[]) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

  const currentMonthTotal = trendPerMonth[currentMonth];
  const previousMonthTotal = trendPerMonth[previousMonth];

  let percentageChange: number;
  if (previousMonthTotal === 0) {
    percentageChange = currentMonthTotal === 0 ? 0 : 100;
  } else {
    percentageChange =
      ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
  }

  return percentageChange;
}

export async function genAccountNumber(uuidStr: string): Promise<bigint> {
  const hexString = uuidStr.replace(/-/g, '');
  const data = BigInt('0x' + hexString);
  const account_number = data.toString().slice(-11);
  return BigInt(account_number);
}

export function VerifymeCheck(docNumber: string | null | undefined) {
  if (
    docNumber === null ||
    docNumber === undefined ||
    docNumber.trim() === ''
  ) {
    return false;
  }

  return true;
}

export function generateStoreNumber(length: number) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let storeNumber = '';

  for (let i = 0; i < length / 2; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    storeNumber += alphabet.charAt(randomIndex);
  }

  for (let i = 0; i < length / 2; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    storeNumber += numbers.charAt(randomIndex);
  }

  return storeNumber;
}

export function generateTransactionNumber() {
  const time = Date.now();
  const randomNumber = Math.floor(Math.random() * 1000000001);
  const uniqueId = 'Txn' + time + randomNumber;
  return uniqueId;
}

export function generatePassword(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  const charactersLength: number = characters.length;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function capitalizeWords(input: string): string {
  const words = input.toLowerCase().split(' ');

  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );

  const result = capitalizedWords.join(' ');

  return result;
}

export function mergeSpecsAndPrices(products: ProductDTO[]) {
  const mergedProducts: ProductDTO[] = [];

  products.forEach((product) => {
    const existingProduct = mergedProducts.find(
      (p) => p.productId === product.productId,
    );

    if (existingProduct) {
      const specsAndPrices = product.specsAndPrices || [];
      existingProduct.specsAndPrices =
        existingProduct?.specsAndPrices?.concat(specsAndPrices);
    } else {
      mergedProducts.push({ ...product });
    }
  });

  mergedProducts.forEach((product) => {
    const uniqueSpecs = new Set<string>();
    product.specsAndPrices = (product.specsAndPrices || []).filter(
      (specAndPrice) => {
        const isUnique = !uniqueSpecs.has(specAndPrice.specification);
        uniqueSpecs.add(specAndPrice.specification);
        return isUnique;
      },
    );
  });

  return mergedProducts;
}

export const filterUniqueCategories = (
  categories: {
    VendorId: string;
    RfqCategoryId: string;
  }[],
) => {
  return categories.filter((item, index, self) => {
    const firstIndex = self.findIndex(
      (i) => i.RfqCategoryId === item.RfqCategoryId,
    );

    return index === firstIndex;
  });
};

export const extractEmailAndUUID = (
  inputStrings: string[],
): { emails: string[]; uuids: string[] } => {
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const uuidPattern =
    /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/;

  const emails = [];
  const uuids = [];

  inputStrings?.forEach((string) => {
    const emailMatches = string.match(emailPattern);
    const uuidMatches = string.match(uuidPattern);
    if (emailMatches) {
      emails.push(emailMatches[0]);
    }

    if (uuidMatches) {
      uuids.push(uuidMatches[0]);
    }
  });

  return { emails, uuids };
};

export const getDuration = async (
  startDate: Date,
  endDate: Date,
): Promise<string> => {
  const startMoment = moment(startDate);
  const endMoment = moment(endDate);

  const weeks = endMoment.diff(startMoment, 'weeks');
  const months = endMoment.diff(startMoment, 'months');
  const days = endMoment.diff(startMoment, 'days');

  let duration = '';

  if (weeks > 0) {
    duration += `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
    if (months > 0 || days > 0) {
      duration += ', ';
    }
  }

  if (months > 0) {
    duration += `${months} ${months === 1 ? 'month' : 'months'}`;
    if (days > 0) {
      duration += ', ';
    }
  }

  if (days > 0) {
    duration += `${days} ${days === 1 ? 'day' : 'days'}`;
  }

  return duration;
};

export type ExpiryUnit =
  | 'minute'
  | 'minutes'
  | 'hour'
  | 'hours'
  | 'day'
  | 'days'
  | 'month'
  | 'months'
  | 'year'
  | 'years';

export function generateJwtExpiry(value: number, unit: ExpiryUnit): Date {
  if (value <= 0) {
    throw new Error('Invalid expiration value');
  }

  const singularUnit = unit.replace(/s$/, '');

  let expirationDate: moment.Moment;

  switch (singularUnit) {
    case 'minute':
    case 'hour':
    case 'day':
    case 'month':
    case 'year':
      expirationDate = moment().add(value, singularUnit);
      break;
    default:
      throw new Error('Invalid expiration unit');
  }

  return expirationDate.toDate();
}

export function generateReference(): string {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return `Cut-${result}-${Date.now()}`;
}
