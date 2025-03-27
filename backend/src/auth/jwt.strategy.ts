import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { passportJwtSecret } from "jwks-rsa";
import { ConfigService } from "@nestjs/config";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService, private readonly databaseService: DatabaseService) {
        super({
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `${configService.getOrThrow("AUTH0_ISSUER_URL")}.well-known/jwks.json`
            }),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            audience: `${configService.getOrThrow("AUTH0_AUDIENCE")}`,
            issuer: configService.getOrThrow("AUTH0_ISSUER_URL"),
            algorithms: ['RS256']
        })
    }
    async validate(payload: any) {
        const sub: string = payload.sub
        let user_id = await this.databaseService.getDb()
            .selectFrom('usr')
            .select('id')
            .where('sub', '=', sub)
            .executeTakeFirst();

        if (!user_id) {
            const result = await this.databaseService.getDb()
                .insertInto('usr')
                .values({ sub: sub })
                .returning(['id'])
                .executeTakeFirstOrThrow()
            user_id = { id: result.id }
        }

        return { "user_id": user_id?.id }
    }
}