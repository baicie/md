import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { SettingsModule } from './settings/settings.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [FilesModule, UsersModule, SettingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
