import { Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CustomException } from '../main';

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
