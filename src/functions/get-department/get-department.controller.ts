import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';

import { GetDepartmentService } from './get-department.service';

import { DepartmentError } from '../types';

import { Route } from '../../shared';
import { DepartmentParam } from '../../dtos/params/department-param';

@Controller(Route.Jobs)
export class GetDepartmentController {
  constructor(private readonly deptService: GetDepartmentService) {}

  @Get(':department')
  async get(@Param() { department }: DepartmentParam, @Res() res: Response) {
    const result = await this.deptService.get(department);
    if (Array.isArray(result)) {
      return res.json(result);
    }
    switch (result) {
      case DepartmentError.NoDepartmentFound:
        throw new NotFoundException(result);
    }
  }
}
