import { EntityRepository, Repository } from 'typeorm';
import { omit } from 'lodash';
import { Logger, InternalServerErrorException } from '@nestjs/common';

import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepo');

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where('task.userId := userId', { userId: user.id });
    if (status) query.andWhere('task.status =:status', { status });
    if (search)
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (err) {
      this.logger.error(`Get Tasks Error ${filterDto}`, err.stack);
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();

    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    try {
      await task.save();

      return omit(task, 'user');
    } catch (err) {
      this.logger.error(
        `Creating New Task Error. User: ${user.userName} Task: ${JSON.stringify(
          createTaskDto,
        )}`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
