import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, RequestMethod } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { MiddlewareConsumer } from '@nestjs/common';
import { CreateTaskRequest } from './tasks/requests/create.task.request';

@Module({
  imports: [TasksModule, AuthModule, TypeOrmModule.forRoot(typeOrmConfig)],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CreateTaskRequest)
    .forRoutes({ path: 'tasks', method: RequestMethod.POST})
  }

}
