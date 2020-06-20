import { PipeTransform, BadRequestException } from '@nestjs/common';

import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.OPEN,
  ];
  transform(value: unknown) {
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is an invalid status`);
    }
    return value;
  }

  isStatusValid(status: any): status is TaskStatus {
    return this.allowedStatuses.includes(status);
  }
}
