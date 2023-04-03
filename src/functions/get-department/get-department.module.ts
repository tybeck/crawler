import { Module } from '@nestjs/common';

import { GetDepartmentController } from './get-department.controller';
import { GetDepartmentService } from './get-department.service';

@Module({
  imports: [],
  controllers: [GetDepartmentController],
  providers: [GetDepartmentService],
})
export class GetDepartmentModule {}
