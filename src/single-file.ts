import {
  Catch,
  Controller,
  ExceptionFilter,
  Get,
  HttpException,
  Inject,
  Module,
  Scope,
} from '@nestjs/common';
import { NestFactory, REQUEST } from '@nestjs/core';

// SAME AS THE ALL THE OTHER FILES. JUST IN ONE SINGLE FILE.

@Controller('app')
export class AppController {
  constructor(
    @Inject('CONNECTION')
    private readonly connection
  ) {}

  @Get()
  get(): boolean {
    console.log(this.connection);

    return true;
  }
}

@Module({
  imports: [],
  providers: [
    {
      provide: 'CONNECTION',
      scope: Scope.REQUEST,
      inject: [REQUEST],
      useFactory: async (request: Request) => {
        console.log('connectionFactory - useFactory - 1');
        throw new CustomException();
      },
    }
  ],
  exports: ['CONNECTION'],
})
export class ConnectionModule {}

@Module({
  imports: [
    ConnectionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

export class CustomException extends Error {
  constructor() {
    super('CUSTOM EXCEPTION');
  }
}

@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter {
  public catch(): any {
    console.log('CustomExceptionFilter - catch - 1');

    // throwing an error here return in an "UnhandledPromiseRejectionWarning" in the console, and response is never sent.
    // throw new Error('test');

    // throwing an HttpException here return in an "UnhandledPromiseRejectionWarning" in the console, and response is never sent.
    throw new HttpException('test', 400);

    // returning a custom error object results in the response never getting terminated
    // return new Error('custom error');
  }
}

// This fails as well.
//
// @Catch(CustomException)
// export class CustomExceptionFilter extends BaseExceptionFilter {
//   public catch(exception, host): any {
//     console.log('CustomExceptionFilter - catch - 2');
//
//     // Extending the BaseExceptionFilter and just calling super results in "UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'reply' of undefined"
//     super.catch(exception, host);
//   }
// }

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new CustomExceptionFilter());
  await app.listen(3000);
}
bootstrap();
