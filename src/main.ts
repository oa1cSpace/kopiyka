import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable global validation and transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove unknown properties
      transform: true, // Enable class-transformer
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(PORT);
  console.info(`OK! API started & rynning on port: ${PORT}`);
}
bootstrap();
