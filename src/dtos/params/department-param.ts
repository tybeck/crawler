import { IsString, ValidateIf } from 'class-validator';

export class DepartmentParam {
  @IsString()
  @ValidateIf(({ department }) => department.trim().length !== 0, {
    message: 'Department is required!',
  })
  department: string;
}
