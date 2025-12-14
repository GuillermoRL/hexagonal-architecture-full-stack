import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('Starting application...');
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    app.setGlobalPrefix('api');

    await app.listen(8080);
    console.log(`Application is running on: http://localhost:8080/api`);
  } catch (error) {
    console.error('Error during bootstrap:', error);
    process.exit(1);
  }
}
bootstrap();
