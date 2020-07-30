import { Module } from '@nestjs/common';
import { ConnectionModule } from './connection/connection.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConnectionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
