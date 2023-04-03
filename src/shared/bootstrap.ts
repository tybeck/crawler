import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import serverlessExpress from '@vendia/serverless-express';
import { Handler } from 'aws-lambda';

let instance: Handler;

/**
 * @method bootstrap
 * Bootstraps by passing a functions specified module to nest; we create
 * this once to help reduce start-time.
 * @param module
 */
export async function bootstrap<T = any>(module: T): Promise<Handler> {
  if (instance) {
    return Promise.resolve(instance);
  }

  const application = await NestFactory.create(module);
  application.useGlobalPipes(new ValidationPipe());
  await application.init();

  const app = application.getHttpAdapter().getInstance();
  instance = serverlessExpress({ app });
  return instance;
}
