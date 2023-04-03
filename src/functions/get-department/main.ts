import { Callback, Context, Handler } from 'aws-lambda';

import { bootstrap } from '../../shared';

import { GetDepartmentModule } from './get-department.module';

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  const server = await bootstrap(GetDepartmentModule);
  return server(event, context, callback);
};
