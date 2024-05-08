import { Module } from "@nestjs/common";
import { LoggerModule as LM } from "nestjs-pino";
import pretty from "pino-pretty";

@Module({
  imports: [
    LM.forRoot({
      pinoHttp: {
        level: "debug",
        stream: pretty({
          colorize: true,
          singleLine: true
        })
      }
    })
  ]
})
export class AppLoggerModule {
}
