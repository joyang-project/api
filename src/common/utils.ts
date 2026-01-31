import { BadRequestException } from '@nestjs/common';

export function convertTimeToSeconds(time: string): number {
  if (!time) {
    throw new BadRequestException('Time string is required');
  }
  const value = parseInt(time.slice(0, -1));
  const unit = time.slice(-1);

  if (isNaN(value)) {
    throw new BadRequestException('Invalid time value');
  }

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 24 * 60 * 60;
    default:
      throw new BadRequestException('Invalid time unit for token expiration');
  }
}
